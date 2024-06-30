package com.inven.tree;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.inven.tree.config.RecaptchaConfig;
import com.inven.tree.mapper.MembersMapper;
import com.inven.tree.model.Auths;
import com.inven.tree.model.Members;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://inventree.shop"}, allowCredentials = "true")
public class MembersController {

    private static final Logger logger = LoggerFactory.getLogger(MembersController.class);

    @Autowired
    private MembersMapper membersMapper;

    @Autowired
    private RecaptchaConfig recaptchaConfig;

    private InputValidation inputValidation = new InputValidation();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpSession session) {
        String mbId = loginData.get("mbId");
        String mbPw = loginData.get("mbPw");
        String corpIdx = loginData.get("corpIdx");
        String captchaToken = loginData.get("captchaToken");

        logger.info("Login attempt for user: {}", mbId);

        if (mbId == null || mbPw == null || corpIdx == null || captchaToken == null) {
            logger.warn("Invalid login input for user: {}", mbId);
            return ResponseEntity.badRequest().body("Invalid input");
        }

        if (!inputValidation.validateMbId(mbId)) {
            return ResponseEntity.badRequest().body("invalid_id");
        }

        if (!inputValidation.validatePassword(mbPw)) {
            return ResponseEntity.badRequest().body("invalid_password");
        }

        if (!inputValidation.validateCorpCode(corpIdx)) {
            return ResponseEntity.badRequest().body("invalid_corp_code");
        }

        if (!verifyCaptcha(captchaToken)) {
            return ResponseEntity.badRequest().body("invalid_captcha");
        }

        try {
            int count = membersMapper.login(new Members(mbId, mbPw, corpIdx));
            if (count > 0) {
                Members user = new Members(mbId, mbPw, corpIdx);
                session.setAttribute("user", user);
                session.setAttribute("corpIdx", corpIdx);

                Auths permissions = membersMapper.getPermissions(mbId);
                if (permissions != null) {
                    session.setAttribute("inventoryYn", permissions.getInventoryYn());
                    session.setAttribute("shipYn", permissions.getShipYn());
                    session.setAttribute("chartYn", permissions.getChartYn());
                    session.setAttribute("setYn", permissions.getSetYn());
                }

                String userTheme = membersMapper.getMbTheme(mbId);
                session.setAttribute("theme", userTheme);

                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("theme", userTheme);
                response.put("permissions", permissions);

                logger.info("User {} logged in successfully. Theme: {}", mbId, userTheme);
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Login failed for user: {}", mbId);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            logger.error("Error during login process for user: {}", mbId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login process failed");
        }
    }

    @GetMapping("/checkSession")
    public String checkSession(HttpSession session) {
        Members user = (Members) session.getAttribute("user");
        return user != null ? "loggedIn" : "loggedOut";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "loggedOut";
    }

    @PostMapping("/user/theme")
    public ResponseEntity<?> updateTheme(@RequestBody Map<String, String> themeData, HttpSession session) {
        try {
            Members user = (Members) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in");
            }
            String newTheme = themeData.get("theme");
            membersMapper.updateMbTheme(user.getMbId(), newTheme);
            session.setAttribute("theme", newTheme);
            return ResponseEntity.ok().body(Map.of("theme", newTheme));
        } catch (Exception e) {
            logger.error("Failed to update theme", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update theme");
        }
    }

    @GetMapping("/user/theme")
    public ResponseEntity<?> getTheme(HttpSession session) {
        try {
            Members user = (Members) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in");
            }
            String theme = (String) session.getAttribute("theme");
            return ResponseEntity.ok().body(Map.of("theme", theme));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch theme");
        }
    }

    @GetMapping("/members")
    public List<Members> getMembers(HttpSession session) {
        String corpIdx = (String) session.getAttribute("corpIdx");
        if (corpIdx != null) {
            List<Members> members = membersMapper.findMembersByCorpIdx(corpIdx);
            return members;
        }
        return List.of();
    }

    @PostMapping("/members/save")
    @Transactional
    public ResponseEntity<String> saveMemberAndAuth(@RequestBody List<MemberWithAuth> memberWithAuthList) {
        try {
            for (MemberWithAuth memberWithAuth : memberWithAuthList) {
                Members member = memberWithAuth.getMember();
                membersMapper.save(member);

                Auths auth = memberWithAuth.getAuth();
                auth.setMbId(member.getMbId());
                membersMapper.saveAuth(auth);
            }
            return ResponseEntity.ok("Members and auths saved successfully");
        } catch (Exception e) {
            logger.error("Error saving members and auths", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving members and auths");
        }
    }

    @PostMapping("/members/delete")
    public void deleteMembers(@RequestBody List<Members> members) {
        for (Members member : members) {
            membersMapper.delete(member);
        }
    }

    @GetMapping("/members/auths")
    public List<Auths> getAllAuths() {
        List<Auths> auths = membersMapper.findAllAuths();
        return auths;
    }

    @PostMapping("/members/import")
    public List<Members> importMembers(@RequestParam("file") MultipartFile file) {
        return List.of();
    }

    @GetMapping("/userInfo")
    public ResponseEntity<?> getUserInfo(HttpSession session) {
        try {
            Members user = (Members) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in");
            }

            Members memberInfo = membersMapper.findByIdAndCorpIdx(user.getMbId(), user.getCorpIdx());
            if (memberInfo == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");
            }

            if (String.valueOf(memberInfo.getIsAdmin()).equals("Y")) {
                memberInfo.setRole("관리자");
            } else {
                Auths auths = membersMapper.findAuthsByMbIdAndCorpIdx(user.getMbId(), user.getCorpIdx());
                if (auths == null) {
                    memberInfo.setRole("사원");
                } else {
                    StringBuilder roles = new StringBuilder();
                    if ("Y".equals(String.valueOf(auths.getInventoryYn()))) roles.append("재고/");
                    if ("Y".equals(String.valueOf(auths.getShipYn()))) roles.append("입출고/");
                    if ("Y".equals(String.valueOf(auths.getChartYn()))) roles.append("통계/");
                    if ("Y".equals(String.valueOf(auths.getSetYn()))) roles.append("설정/");
                    if (roles.length() > 0) roles.setLength(roles.length() - 1);
                    memberInfo.setRole(roles.toString());
                }
            }

            return ResponseEntity.ok(memberInfo);
        } catch (Exception e) {
            logger.error("Failed to get user info", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to get user info");
        }
    }

    private boolean verifyCaptcha(String captchaToken) {
        String url = "https://www.google.com/recaptcha/api/siteverify";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> body = new HashMap<>();
        body.put("secret", recaptchaConfig.getSecretKey());
        body.put("response", captchaToken);

        StringBuilder requestBody = new StringBuilder();
        for (Map.Entry<String, String> entry : body.entrySet()) {
            if (requestBody.length() > 0) {
                requestBody.append("&");
            }
            requestBody.append(entry.getKey()).append("=").append(entry.getValue());
        }

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

        try {
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> response = responseEntity.getBody();
            return response != null && Boolean.TRUE.equals(response.get("success"));
        } catch (Exception e) {
            return false;
        }
    }
}

class MemberWithAuth {
    private Members member;
    private Auths auth;

    // getters and setters
    public Members getMember() {
        return member;
    }

    public void setMember(Members member) {
        this.member = member;
    }

    public Auths getAuth() {
        return auth;
    }

    public void setAuth(Auths auth) {
        this.auth = auth;
    }
}