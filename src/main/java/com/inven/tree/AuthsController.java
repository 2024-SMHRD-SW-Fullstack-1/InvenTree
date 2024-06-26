package com.inven.tree;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.AuthsMapper;
import com.inven.tree.model.Auths;

@RequestMapping("/api")
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthsController {
	
	@Autowired
	private AuthsMapper authsMapper;
	
	// 권한 정보 불러오기
	@GetMapping("/auths")
	public List<Auths> getMembersWithAuthsByCorpIdx(HttpSession session) {
	    String corpIdx = (String) session.getAttribute("corpIdx");
	    return authsMapper.selectAllAuthsByCorpIdx(corpIdx);
	}
	
	// 권한 정보 변경
	@PutMapping("/auths/update")
	public ResponseEntity<String> updateAuths(@RequestBody List<Auths> auths) {
		System.out.println(auths);
		try {
        	if(auths != null) {
        		for (Auths auth : auths) {
        			authsMapper.updateAuth(auth); // 권한 정보 변경
        		}
            }
            return ResponseEntity.ok("권한 정보 변경 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("권한 정보 변경 실패: " + e.getMessage());
        }
	}

	

}
