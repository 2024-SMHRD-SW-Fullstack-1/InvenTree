package com.inven.tree;

import java.util.List;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.inven.tree.mapper.MembersMapper;
import com.inven.tree.model.Members;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MembersController {

    private static final Logger logger = LoggerFactory.getLogger(MembersController.class);

    @Autowired
    private MembersMapper membersMapper;
    
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
        
        if (!inputValidation.validatePassword(members.getMbPw())) {
            logger.warn("Invalid password format for user: {}", members.getMbId());
            return "invalid_password";
        }
        
        if (!inputValidation.validateCorpCode(members.getCorpIdx())) {
            logger.warn("Invalid corporate code format for user: {}", members.getMbId());
            return "invalid_corp_code";
        }

        int count = membersMapper.login(members);
        if (count > 0) {
            session.setAttribute("user", members); // 세션에 사용자 정보 저장
            logger.info("Login success for user: {}", members.getMbId());
            return "success";
        }
        logger.info("Login failed for user: {}", members.getMbId());
        return "fail";
    }

    @GetMapping("/members")
    public List<Members> getMembers() {
        return membersMapper.findAll();
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
}
