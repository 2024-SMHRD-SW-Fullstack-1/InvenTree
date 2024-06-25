package com.inven.tree;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.AuthsMapper;
import com.inven.tree.model.Auths;
import com.inven.tree.model.Shelves;
import com.inven.tree.model.Warehouses;

@RequestMapping("/api")
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthsController {
	
	@Autowired
	private AuthsMapper authsMapper;
	
	@GetMapping("/auths")
	public List<Auths> getMembersWithAuthsByCorpIdx(HttpSession session) {
	    String corpIdx = (String) session.getAttribute("corpIdx");
	    System.out.println("확인용 : "+corpIdx); // 2번 출력됨
	    return authsMapper.selectAllAuthsByCorpIdx(corpIdx);
	}
	
	@PutMapping("/auths/update")
	public ResponseEntity<String> updateAuths(@RequestBody List<Auths> auths) {
		System.out.println(auths);
		try {
        	if(auths != null) {
        		for (Auths auth : auths) {
        			authsMapper.updateAuth(auth);
        		}
            }
            return ResponseEntity.ok("Shelves updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating shelves: " + e.getMessage());
        }
	}
	
	@PutMapping("/auths/delete")
	public ResponseEntity<String> deleteAuths(@RequestBody List<Auths> auths){
		
		try {
        	if(auths != null) {
        		for (Auths auth : auths) {
        			authsMapper.deleteAuths(auth);
        		}
            }
            return ResponseEntity.ok("Shelves updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating shelves: " + e.getMessage());
        }
		
	}
	
	@PostMapping("/auths/insert")
	public ResponseEntity<String> insertAuths(@RequestBody List<Auths> auths, HttpSession session) {
		String loginCorpIdx = (String)session.getAttribute("corpIdx");
		System.out.println(loginCorpIdx);
		System.out.println("============================"+auths);
	    try {
	        // corpIdx가 null이거나 비어있는지 확인
	        if (loginCorpIdx == null || loginCorpIdx.isEmpty()) {
	        	System.out.println("회사코드가 없음");
	            return ResponseEntity.badRequest().body("corpIdx not found in session.");
	            
	        }

	        // auths에 corpIdx 설정
	        for (Auths auth : auths) {
	            auth.setCorpIdx(loginCorpIdx); // corpIdx 설정
	            System.out.println(auth);
	            authsMapper.insertAuths(auth); // 데이터베이스에 삽입
	        }

	        return ResponseEntity.ok("Auths inserted successfully.");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Error inserting Auths: " + e.getMessage());
	    }
	}
	

}
