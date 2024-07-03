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
	
	// 특정 기업의 권한 정보를 불러오는 메서드
	@GetMapping("/auths")
	public List<Auths> getMembersWithAuthsByCorpIdx(HttpSession session) {
	    String corpIdx = (String) session.getAttribute("corpIdx"); // 세션에서 corpIdx를 가져옴
	    return authsMapper.selectAllAuthsByCorpIdx(corpIdx); // corpIdx를 기준으로 권한 정보를 조회
	}
	
	// 권한 정보를 변경하는 메서드
	@PutMapping("/auths/update")
	public ResponseEntity<String> updateAuths(@RequestBody List<Auths> auths) {
		try {
        	if(auths != null) {
        		for (Auths auth : auths) {
        			authsMapper.updateAuth(auth); // 각 권한 정보를 업데이트
        		}
            }
            return ResponseEntity.ok("권한 정보 변경 성공"); // 성공 메시지 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("권한 정보 변경 실패: " + e.getMessage()); // 오류 메시지 반환
        }
	}
	

}
