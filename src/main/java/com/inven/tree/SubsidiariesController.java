package com.inven.tree;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.SubsidiariesMapper;
import com.inven.tree.model.Subsidiaries;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SubsidiariesController {
	 
	@Autowired
	private SubsidiariesMapper subsidiariesMapper;
	 
	@GetMapping("/subsidiary")
	@ResponseBody
	public List<Subsidiaries> getSubsidiary() {
		return subsidiariesMapper.selectAllSubsidiary();
	}
	
	// corpIdx인 subsidiary 업체 정보 출력  
	@GetMapping("/subsidiaries")
	public List<Subsidiaries> getSubsidiaryByCorpIdx(HttpSession session){
		 String corpIdx = (String) session.getAttribute("corpIdx");
		 System.out.println(corpIdx);
		 return subsidiariesMapper.selectSubsidiaryByCorpIdx(corpIdx);
	}
	
	// 업체 정보 변경
	@PutMapping("/subsidiaries/update")
	public ResponseEntity<String> updateAuths(@RequestBody List<Subsidiaries> subsidiaries) {
		System.out.println(subsidiaries);
		try {
        	if(subsidiaries != null) {
        		for (Subsidiaries subsidiary : subsidiaries) {
        			subsidiariesMapper.updateSubsidiary(subsidiary); // 권한 정보 변경
        		}
            }
            return ResponseEntity.ok("업체 정보 변경 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("업체 정보 변경 실패: " + e.getMessage());
        }
	}
	
	// 업체 정보 추가
	@PostMapping("/subsidiaries/insert")
	public ResponseEntity<String> insertAuths(@RequestBody List<Subsidiaries> subsidiaries, HttpSession session) {
	    
		try {
			// 로그인한 계정의 corpIdx 가져오기
			String loginCorpIdx = (String)session.getAttribute("corpIdx");
	        // corpIdx가 null이거나 비어있는지 확인
	        if (loginCorpIdx == null || loginCorpIdx.isEmpty()) {
	        	System.out.println("회사코드가 없음");
	            return ResponseEntity.badRequest().body("session에 corpIdx가 없습니다.");
	            
	        }

	        // subsidiary에 corpIdx 설정
	        for (Subsidiaries subsidiary : subsidiaries) {
	            subsidiary.setCorpIdx(loginCorpIdx); // corpIdx 설정
	            System.out.println(subsidiary);
	            subsidiariesMapper.insertSubsidiary(subsidiary); // 데이터베이스에 삽입
	        }

	        return ResponseEntity.ok("권한 정보 추가 성공");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("권한 추가 에러: " + e.getMessage());
	    }
	}
	// 업체 정보 삭제
	@PutMapping("/subsidiaries/delete")
	public ResponseEntity<String> deleteSubsidiaries(@RequestBody List<Subsidiaries> subsidiaries) {
		System.out.println(subsidiaries);
		System.out.println("확인용");
		try {
			if(subsidiaries != null && !subsidiaries.isEmpty()) { 
        		for (Subsidiaries subsidiary : subsidiaries) {
        		subsidiariesMapper.deleteSubsidiary(subsidiary); // 업체 삭제
        		}
            }else {
            	return ResponseEntity.badRequest().body("삭제할 정보가 없습니다.");
            }
			
			return ResponseEntity.ok("업체 정보 삭제 성공");
		} catch (DataIntegrityViolationException e) {
	        // 제약 조건 등의 이유로 삭제가 실패한 경우
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("업체 삭제에 실패했습니다. 제약 조건에 의해 삭제할 수 없는 데이터가 존재합니다.");
	    } catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("업체 삭제 에러: " + e.getMessage());
		}
	}
}