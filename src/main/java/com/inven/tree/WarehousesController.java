package com.inven.tree;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.mapper.WarehousesMapper;
import com.inven.tree.model.Auths;
import com.inven.tree.model.Shelves;
import com.inven.tree.model.Warehouses;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class WarehousesController {

    @Autowired
    private WarehousesMapper warehousesMapper;
    
    @Autowired
    private ShelvesMapper shelvesMapper;
    
    // 창고 선반 corpIdx로 조회
    @GetMapping("/warehouse")
    public List<Warehouses> getWarehousesAndShelves(HttpSession session) {
        String corpIdx = (String) session.getAttribute("corpIdx");
        List<Warehouses> result = warehousesMapper.getWarehousesAndShelvesByCorpIdx(corpIdx);
        return result;
    }
	
    //선반에 상품 있을 경우 삭제가 되지 않음. 제약조건 에러 예외 처리
    private Throwable getRootCause(Throwable throwable) {
		Throwable cause = throwable;
		while (cause.getCause() != null) {
			cause = cause.getCause();
		}
		System.out.println(cause);
		return cause;
	}

    @Transactional // 트랜잭션 관리 추가
    @DeleteMapping("/warehouse/delete")
    public ResponseEntity<String> deleteWarehousesAndShelves(
            @RequestBody Map<String, List<Integer>> requestData) {

        List<Integer> loginWhIdx = requestData.get("loginWhIdx");
        List<Integer> loginShelfIdx = requestData.get("loginShelfIdx");

        try {
            if (loginWhIdx == null || loginWhIdx.isEmpty()) {
                System.out.println("오류1: warehouseIdsToDelete is empty");
                return ResponseEntity.badRequest().body("warehouseIdsToDelete is empty");
            }

            if (loginShelfIdx != null && !loginShelfIdx.isEmpty()) {
                System.out.println("Deleting shelves with IDs: " + loginShelfIdx);
                shelvesMapper.deleteShelvesByShelfIdxAndWhIdx(loginShelfIdx, loginWhIdx);
                System.out.println("Shelves deleted: " + loginShelfIdx);
            } else {
                System.out.println("오류2: shelfIdsToDelete is empty");
            }

            // 삭제 후 선반 데이터가 있는지 확인
            List<Shelves> shelvesExist = shelvesMapper.selectAllShelvesBywhIdx(loginWhIdx); 
            System.out.println("Existing Shelves after deletion: " + shelvesExist);

            // 선반 데이터가 없는 경우에만 창고 삭제
            if (shelvesExist.isEmpty()) {
                System.out.println("Deleting warehouses with IDs: " + loginWhIdx);
                warehousesMapper.deleteWarehouses(loginWhIdx);
                System.out.println("Warehouses deleted: " + loginWhIdx);
                return ResponseEntity.ok("창고 및 선반 삭제 성공");
            } else {
                System.out.println("창고 삭제 안함: 선반 데이터가 존재함");
                return ResponseEntity.badRequest().body("선반 데이터가 존재하여 창고를 삭제할 수 없습니다.");
            }
        } catch (DataIntegrityViolationException e) {
            Throwable rootCause = getRootCause(e);
            if (rootCause instanceof SQLIntegrityConstraintViolationException) {
                return ResponseEntity.badRequest().body("선반에 상품이 있어 삭제가 되지 않습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("창고 및 선반 삭제 중 오류 발생: " + e.getMessage());
            }
        } catch (NumberFormatException e) {
            System.err.println("NumberFormatException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("잘못된 형식의 ID가 전달되었습니다: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("창고 및 선반 삭제 중 오류 발생: " + e.getMessage());
        }
    }
    
    
    //창고 정보 변경
    @PutMapping("/warehouse/update")
    public ResponseEntity<String> updateWarehouse(@RequestBody List<Warehouses> warehouses) {
    	System.out.println(warehouses);
        try {
        	for(Warehouses warehouse : warehouses)
            warehousesMapper.updateWarehouse(warehouse);
            return ResponseEntity.ok("Warehouse updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating warehouse: " + e.getMessage());
        }
    }
    
    //선반 정보 변경
    @Transactional
    @PutMapping("/shelf/update")
    public ResponseEntity<String> updateShelves(@RequestBody List<Shelves> shelves) {

    	try {
        	if(shelves != null) {
        		for (Shelves shelf : shelves) {
        			shelvesMapper.updateShelf(shelf);
        		}
            }
            return ResponseEntity.ok("Shelves updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating shelves: " + e.getMessage());
        }
    }  
    
    // 창고 정보 추가
    @PostMapping("/warehouses/insert")
    public ResponseEntity<String> insertWarehouses(@RequestBody List<Warehouses> warehouses, HttpSession session) {
        String loginCorpIdx = (String)session.getAttribute("corpIdx");
        System.out.println("Session corpIdx: " + loginCorpIdx);
        
        try {
            // 로그인한 계정의 corpIdx 가져오기
            // corpIdx가 null이거나 비어있는지 확인
            if (loginCorpIdx == null || loginCorpIdx.isEmpty()) {
                System.out.println("회사코드가 없음");
                return ResponseEntity.badRequest().body("session에 corpIdx가 없습니다.");
            }
            System.out.println("-----------"); //확인용
            
            // warehouses에 corpIdx 설정
            for (Warehouses warehouse : warehouses) {
                warehouse.setCorpIdx(loginCorpIdx); // corpIdx 설정
                System.out.println("Inserting warehouse: " + warehouse);
                warehousesMapper.insertWarehouse(warehouse); // 데이터베이스에 삽입
                System.out.println("Insert result: " + warehouse);
            }

            return ResponseEntity.ok("창고 정보 추가 성공");
        } catch (Exception e) {
            e.printStackTrace(); // 예외 스택 트레이스 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("권한 추가 에러: " + e.getMessage());
        }
    }
    
    // 선반 정보 추가
    @PostMapping("/shelves/insert")
    public ResponseEntity<String> insertShelves(@RequestBody List<Shelves> shelves) {
        
    	try {
            // shelves에 있는 각 선반 정보를 처리
            for (Shelves shelf : shelves) {
                if (shelf.getWhIdx() == null) {
                    return ResponseEntity.badRequest().body("선반에 wh_idx가 없습니다.");
                }
                
                
                shelvesMapper.insertShelf(shelf); // 데이터베이스에 삽입하는 코드 (추가 작업 필요)
                System.out.println("Insert result: " + shelf);
            }

            return ResponseEntity.ok("선반 정보 추가 성공");
        } catch (Exception e) {
            e.printStackTrace(); // 예외 스택 트레이스 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("선반 정보 추가 에러: " + e.getMessage());
        }
    }


}
