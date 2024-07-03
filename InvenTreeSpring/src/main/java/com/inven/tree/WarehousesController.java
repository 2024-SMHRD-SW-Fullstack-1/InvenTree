package com.inven.tree;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.MembersMapper;
import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.mapper.WarehousesMapper;
import com.inven.tree.model.Members;
import com.inven.tree.model.Shelves;
import com.inven.tree.model.Warehouses;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class WarehousesController {

	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(WarehousesController.class);
	
    @Autowired
    private WarehousesMapper warehousesMapper;
    
    @Autowired
    private ShelvesMapper shelvesMapper;
    
    @Autowired
    private MembersMapper membersMapper;
    
    // 세션에서 corpIdx를 가져와 해당 회사의 창고와 선반 목록을 조회하는 GET 엔드포인트
    @GetMapping("/warehouse")
    public List<Warehouses> getWarehousesAndShelves(HttpSession session) {
        String corpIdx = (String) session.getAttribute("corpIdx");
        List<Warehouses> result = warehousesMapper.getWarehousesAndShelvesByCorpIdx(corpIdx);
        return result;
    }
	
    // 선반에 상품이 있는 경우 삭제가 되지 않도록 제약 조건 에러를 처리하는 메서드
    private Throwable getRootCause(Throwable throwable) {
		Throwable cause = throwable;
		while (cause.getCause() != null) {
			cause = cause.getCause();
		}
		System.out.println(cause);
		return cause;
	}

    // 창고와 선반 데이터를 삭제하는 DELETE 엔드포인트
    @DeleteMapping("/warehouse/delete")
    @Transactional // 트랜잭션을 사용하여 원자적 작업을 보장
    public ResponseEntity<Map<String, String>> deleteWarehousesAndShelves(
            @RequestBody Map<String, List<Integer>> requestData) {

        // 요청으로 받은 창고 ID 리스트와 선반 ID 리스트를 추출
        List<Integer> warehouseIds = requestData.get("loginWhIdx");
        List<Integer> shelfIds = requestData.get("loginShelfIdx");
        Map<String, String> response = new HashMap<>();

        try {
            // 창고 ID 리스트가 null이거나 비어 있는지 확인
            if (warehouseIds == null || warehouseIds.isEmpty()) {
                response.put("message", "warehouseIdsToDelete는 비어 있습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 선반 ID 리스트가 null이 아니고 비어 있지 않은지 확인
            if (shelfIds != null && !shelfIds.isEmpty()) {
                // null 값을 제거
                shelfIds = shelfIds.stream()
                                   .filter(Objects::nonNull)
                                   .collect(Collectors.toList());
                if (!shelfIds.isEmpty()) {
                    // 선반과 창고를 함께 삭제하는 로직
                    logger.debug("Deleting shelves with ShelfIdx: {} and WhIdx: {}", shelfIds, warehouseIds);
                    shelvesMapper.deleteShelvesByShelfIdxAndWhIdx(shelfIds, warehouseIds);
                }
            } else {
                // 선반 ID가 없을 경우
                logger.debug("ShelfIds가 없으므로 선반 삭제 없이 창고 삭제를 시도합니다.");
            }

            // 각 창고에 남아 있는 선반이 있는지 확인
            for (Integer warehouseId : warehouseIds) {
                int remainingShelfCount = shelvesMapper.countShelvesByWhIdx(Collections.singletonList(warehouseId));
                logger.debug("Shelf count for WhIdx {}: {}", warehouseId, remainingShelfCount);
                if (remainingShelfCount > 0) {
                    response.put("message", "선반 데이터가 존재하여 창고를 삭제할 수 없습니다.");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // 창고를 삭제하는 로직
            logger.debug("Deleting warehouses with WhIdx: {}", warehouseIds);
            warehousesMapper.deleteWarehouses(warehouseIds);
            response.put("message", "창고 및 선반 삭제 성공");
            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            // 데이터 무결성 위반 예외 처리
            Throwable rootCause = getRootCause(e);
            logger.error("Data integrity violation: {}", rootCause.getMessage());
            if (rootCause instanceof SQLIntegrityConstraintViolationException) {
                response.put("message", "선반에 상품이 있어 삭제 불가능합니다.");
                return ResponseEntity.badRequest().body(response);
            } else {
                response.put("message", "창고 및 선반 삭제 중 오류 발생: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (NumberFormatException e) {
            // 숫자 형식 예외 처리
            logger.error("Number format exception: {}", e.getMessage());
            response.put("message", "잘못된 형식의 ID가 전달되었습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            // 일반 예외 처리
            logger.error("Exception during warehouse and shelves deletion: {}", e.getMessage());
            response.put("message", "창고 및 선반 삭제 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // 창고 정보를 업데이트하는 PUT 엔드포인트
    @PutMapping("/warehouse/update")
    public ResponseEntity<String> updateWarehouse(@RequestBody List<Warehouses> warehouses) {
        // 요청으로 받은 창고 리스트를 출력하여 디버깅에 사용
        System.out.println(warehouses);

        try {
            // 요청으로 받은 창고 리스트를 순회하면서 각 창고를 업데이트
            for (Warehouses warehouse : warehouses) {
                // 창고를 업데이트하는 매퍼 메서드 호출
                warehousesMapper.updateWarehouse(warehouse);
            }
            // 업데이트가 성공적으로 완료되면 HTTP 200 상태와 성공 메시지 반환
            return ResponseEntity.ok("Warehouse updated successfully.");
        } catch (Exception e) {
            // 예외 발생 시 HTTP 500 상태와 오류 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating warehouse: " + e.getMessage());
        }
    }
    
    // 선반 정보를 업데이트하는 PUT 엔드포인트
    @PutMapping("/shelf/update")
    public ResponseEntity<String> updateShelves(@RequestBody List<Shelves> shelves) {

        try {
            // 선반 리스트가 null이 아닌 경우에만 처리
            if (shelves != null) {
                // 선반 리스트를 순회하면서 각 선반을 업데이트
                for (Shelves shelf : shelves) {
                    // 선반을 업데이트하는 매퍼 메서드 호출
                    shelvesMapper.updateShelf(shelf);
                }
            }
            // 업데이트가 성공적으로 완료되면 HTTP 200 상태와 성공 메시지 반환
            return ResponseEntity.ok("Shelves updated successfully.");
        } catch (Exception e) {
            // 예외 발생 시 HTTP 500 상태와 오류 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating shelves: " + e.getMessage());
        }
    }
    
    // 창고와 선반 정보를 삽입하는 POST 엔드포인트
    @PostMapping(value = "/warehouse/insert", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> insertWarehousesAndShelves(@RequestBody Warehouses warehouse, HttpSession session) {
        String loginCorpIdx = (String) session.getAttribute("corpIdx");
        System.out.println("확인");
        try {
            // 로그인한 계정의 corpIdx 가져오기
            if (loginCorpIdx == null || loginCorpIdx.isEmpty()) {
                return ResponseEntity.badRequest().body("session에 corpIdx가 없습니다.");
            }

            // corpIdx 설정
            warehouse.setCorpIdx(loginCorpIdx);

            // 요청 데이터 로그로 출력
            System.out.println("Received warehouse: " + warehouse);

            // 창고 정보 삽입
            warehousesMapper.insertWarehouse(warehouse);
            System.out.println("Warehouse inserted: " + warehouse);

            // 삽입된 창고의 whIdx 확인
            Integer insertedWhIdx = warehouse.getWhIdx();
            if (insertedWhIdx == null) {
                throw new RuntimeException("삽입된 창고의 whIdx를 가져올 수 없습니다.");
            }

            // 선반 정보가 있는 경우에만 처리
            if (warehouse.getShelves() != null && !warehouse.getShelves().isEmpty()) {
                for (Shelves shelf : warehouse.getShelves()) {
                    // 삽입된 창고의 whIdx를 선반에 설정
                    shelf.setWhIdx(insertedWhIdx);
                    // 선반 정보 삽입
                    shelvesMapper.insertShelf(shelf);
                    System.out.println("Shelf inserted: " + shelf);
                }
            }

            return ResponseEntity.ok("창고 및 선반 정보 추가 성공");
        } catch (Exception e) {
            e.printStackTrace(); // 예외 스택 트레이스 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("정보 추가 에러: " + e.getMessage());
        }
    }

    // HTTP 요청을 처리하여 세션에서 corpIdx를 가져와 해당 corpIdx에 속한 멤버 리스트를 반환하는 메서드
    @GetMapping("/warehouse/members")
    public List<Members> getMembers(HttpSession session) {
        // 세션에서 corpIdx 속성을 가져옴
        String corpIdx = (String) session.getAttribute("corpIdx");
        
        // corpIdx에 해당하는 멤버 리스트를 데이터베이스에서 조회
        List<Members> members = membersMapper.findMembersByCorpIdx(corpIdx);
        
        // 조회한 멤버 리스트를 반환
        return members;
    }
    
    // 세션에서 corpIdx를 가져와 해당 회사의 모든 창고를 조회하는 GET 엔드포인트
    @GetMapping("/warehouse/list")
    public ResponseEntity<List<Warehouses>> getWarehouseList(HttpSession session) {
        String corpIdx = (String) session.getAttribute("corpIdx");
        if (corpIdx == null || corpIdx.isEmpty()) {
            logger.error("Session에 corpIdx가 없습니다.");
            return ResponseEntity.badRequest().body(null);
        }
        
        logger.info("Fetching warehouses for corpIdx: {}", corpIdx);
        List<Warehouses> warehouses = warehousesMapper.selectAllWarehouses(corpIdx);
        logger.info("Found {} warehouses", warehouses.size());
        
        return ResponseEntity.ok(warehouses);
    }
}

