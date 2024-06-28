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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.inven.tree.config.RecaptchaConfig;
import com.inven.tree.mapper.MembersMapper;
import com.inven.tree.model.Members;
import com.inven.tree.model.Auths;
import com.inven.tree.InputValidation;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MembersController {

    private static final Logger logger = LoggerFactory.getLogger(MembersController.class);

    @Autowired
    private MembersMapper membersMapper;

    @Autowired
    private RecaptchaConfig recaptchaConfig;

    private InputValidation inputValidation = new InputValidation();

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> loginData, HttpSession session) {
        String mbId = loginData.get("mbId");
        String mbPw = loginData.get("mbPw");
        String corpIdx = loginData.get("corpIdx");
        String captchaToken = loginData.get("captchaToken");

        if (mbId == null || mbPw == null || corpIdx == null || captchaToken == null) {
            return "invalid_input";
        }

        if (!inputValidation.validateMbId(mbId)) {
            return "invalid_id";
        }

        if (!inputValidation.validatePassword(mbPw)) {
            return "invalid_password";
        }

        if (!inputValidation.validateCorpCode(corpIdx)) {
            return "invalid_corp_code";
        }

        if (!verifyCaptcha(captchaToken)) {
            return "invalid_captcha";
        }

        int count = membersMapper.login(new Members(mbId, mbPw, corpIdx));
        if (count > 0) {
            session.setAttribute("user", new Members(mbId, mbPw, corpIdx)); // 세션에 사용자 정보 저장
            session.setAttribute("corpIdx", corpIdx); // 세션에 회사코드 저장
            
            // 로그인 성공 후 권한 정보 조회
            Auths permissions = membersMapper.getPermissions(mbId);
            if (permissions != null) {
                session.setAttribute("inventoryYn", permissions.getInventoryYn());
                session.setAttribute("shipYn", permissions.getShipYn());
                session.setAttribute("chartYn", permissions.getChartYn());
                session.setAttribute("setYn", permissions.getSetYn());
            }
            
            return "success";
        }
        return "fail";
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

    private boolean verifyCaptcha(String captchaToken) {
        String url = "https://www.google.com/recaptcha/api/siteverify";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> body = new HashMap<>();
        body.put("secret", recaptchaConfig.getSecretKey());
        body.put("response", captchaToken);

        // Build the request body in the form format
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

    @GetMapping("/members")
    public List<Members> getMembers(HttpSession session) {
        String corpIdx = (String) session.getAttribute("corpIdx");
        if (corpIdx != null) {
            List<Members> members = membersMapper.findMembersByCorpIdx(corpIdx);
            return members;
        }
        return List.of(); // 회사코드가 없는 경우 빈 리스트 반환
    }

    @PostMapping("/members/save")
    public void saveMembers(@RequestBody List<Members> members) {
        for (Members member : members) {
            membersMapper.save(member);
        }
    }

    @PostMapping("/members/delete")
    public void deleteMembers(@RequestBody List<Members> members) {
        for (Members member : members) {
            membersMapper.deleteAuthsByMemberId(member.getMbId());
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
        // 파일을 파싱하고 Members 객체로 변환하는 로직을 추가하세요
        return List.of();
    }

    @PostMapping("/members/saveWithAuths")
    public void saveMembersWithAuths(@RequestBody List<Members> members, @RequestBody List<Auths> auths) {
        for (Members member : members) {
            membersMapper.save(member);
        }
        for (Auths auth : auths) {
            membersMapper.saveAuth(auth);
        }
    }
}
