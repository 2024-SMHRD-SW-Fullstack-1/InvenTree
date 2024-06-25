package com.inven.tree;

import java.util.List;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.inven.tree.mapper.MembersMapper;
import com.inven.tree.model.Members;
=======
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.inven.tree.mapper.MembersMapper;
import com.inven.tree.model.Members;
import com.inven.tree.model.Auths;

>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MembersController {

    private static final Logger logger = LoggerFactory.getLogger(MembersController.class);

    @Autowired
    private MembersMapper membersMapper;
<<<<<<< HEAD
    
=======

>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
    private InputValidation inputValidation = new InputValidation();

    @PostMapping("/login")
    public String login(@RequestBody Members members, HttpSession session) {
        logger.info("Login attempt with user: {}", members);

        if (members == null || members.getMbId() == null || members.getMbPw() == null || members.getCorpIdx() == null) {
            logger.warn("Invalid input: one of the required fields is null");
            return "invalid_input";
        }

        if (!inputValidation.validateMbId(members.getMbId())) {
            logger.warn("Invalid ID format for user: {}", members.getMbId());
            return "invalid_id";
        }
<<<<<<< HEAD
        
=======

>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
        if (!inputValidation.validatePassword(members.getMbPw())) {
            logger.warn("Invalid password format for user: {}", members.getMbId());
            return "invalid_password";
        }
<<<<<<< HEAD
        
=======

>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
        if (!inputValidation.validateCorpCode(members.getCorpIdx())) {
            logger.warn("Invalid corporate code format for user: {}", members.getMbId());
            return "invalid_corp_code";
        }

        int count = membersMapper.login(members);
        if (count > 0) {
            session.setAttribute("user", members); // 세션에 사용자 정보 저장
<<<<<<< HEAD
=======
            session.setAttribute("corpIdx", members.getCorpIdx()); // 세션에 회사코드 저장
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
            logger.info("Login success for user: {}", members.getMbId());
            return "success";
        }
        logger.info("Login failed for user: {}", members.getMbId());
        return "fail";
    }

    @GetMapping("/members")
<<<<<<< HEAD
    public List<Members> getMembers() {
        return membersMapper.findAll();
=======
    public List<Members> getMembers(HttpSession session) {
        String corpIdx = (String) session.getAttribute("corpIdx");
        logger.info("Fetching members for corpIdx: {}", corpIdx);
        if (corpIdx != null) {
            List<Members> members = membersMapper.findMembersByCorpIdx(corpIdx);
            logger.info("Raw members data: {}", members);
            for (Members member : members) {
                logger.info("Member: {}", member);
            }
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
        logger.info("Fetched auths: {}", auths);
        return auths;
    }

    @PostMapping("/members/import")
    public List<Members> importMembers(@RequestParam("file") MultipartFile file) {
        // 파일을 파싱하고 Members 객체로 변환하는 로직을 추가하세요
        return List.of();
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
    }

    @GetMapping("/checkSession")
    public String checkSession(HttpSession session) {
        Members user = (Members) session.getAttribute("user"); // 세션에서 사용자 정보 확인
        return user != null ? "loggedIn" : "loggedOut";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // 세션 무효화
        return "loggedOut";
    }
<<<<<<< HEAD
=======

    @PostMapping("/members/saveWithAuths")
    public void saveMembersWithAuths(@RequestBody List<Members> members, @RequestBody List<Auths> auths) {
        for (Members member : members) {
            membersMapper.save(member);
        }
        for (Auths auth : auths) {
            membersMapper.saveAuth(auth);
        }
    }
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
}
