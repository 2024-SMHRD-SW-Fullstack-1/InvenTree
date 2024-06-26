package com.inven.tree;

import java.sql.SQLIntegrityConstraintViolationException;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.mapper.WarehousesMapper;
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
	
    //선반에 상품 있을 경우 삭제안되는 예외 처리
    private Throwable getRootCause(Throwable throwable) {
		Throwable cause = throwable;
		while (cause.getCause() != null) {
			cause = cause.getCause();
		}
		return cause;
	}

    @Transactional // 트랜잭션 관리 추가
    @DeleteMapping("/warehouse/delete")
    public ResponseEntity<String> deleteWarehousesAndShelves(
            @RequestBody Map<String, List<Integer>> requestData) {

        List<Integer> warehouseIdsToDelete = requestData.get("warehouseIdsToDelete");
        List<Integer> shelfIdsToDelete = requestData.get("shelfIdsToDelete");
        System.out.println("Received warehouseIdsToDelete: " + warehouseIdsToDelete);
        System.out.println("Received shelfIdsToDelete: " + shelfIdsToDelete);

        try {
            if (warehouseIdsToDelete == null || warehouseIdsToDelete.isEmpty()) {
                System.out.println("오류1: warehouseIdsToDelete is empty");
                return ResponseEntity.badRequest().body("warehouseIdsToDelete is empty");
            }

            if (shelfIdsToDelete != null && !shelfIdsToDelete.isEmpty()) {
                System.out.println("Deleting shelves with IDs: " + shelfIdsToDelete);
                shelvesMapper.deleteShelvesByShelfIdxAndWhIdx(shelfIdsToDelete, warehouseIdsToDelete);
                System.out.println("Shelves deleted: " + shelfIdsToDelete);
            } else {
                System.out.println("오류2: shelfIdsToDelete is empty");
            }

            // 삭제 후 선반 데이터가 있는지 확인
            List<Shelves> shelvesExist = shelvesMapper.selectAllShelvesBywhIdx(warehouseIdsToDelete); 
            System.out.println("Existing Shelves after deletion: " + shelvesExist);

            // 선반 데이터가 없는 경우에만 창고 삭제
            if (shelvesExist.isEmpty()) {
                System.out.println("Deleting warehouses with IDs: " + warehouseIdsToDelete);
                warehousesMapper.deleteWarehouses(warehouseIdsToDelete);
                System.out.println("Warehouses deleted: " + warehouseIdsToDelete);
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
    //재고현황 때문에 추가 개별창고 조회
    @GetMapping("/warehouse/{whIdx}")
    public ResponseEntity<Map<String, Object>> getWarehouseById(@PathVariable Integer whIdx) {
        try {
            Warehouses warehouse = warehousesMapper.selectWarehouseById(whIdx);
            if (warehouse == null) {
                return ResponseEntity.notFound().build();
            }

            List<Shelves> shelves = shelvesMapper.selectShelvesByWhIdx(whIdx);

            Map<String, Object> result = new HashMap<>();
            result.put("whIdx", warehouse.getWhIdx());
            result.put("bidlName", warehouse.getBidlName());
            result.put("mbId", warehouse.getMbId());
            result.put("whAddr", warehouse.getWhAddr());
            result.put("whStatus", warehouse.getWhStatus());

            if (!shelves.isEmpty()) {
                List<Map<String, Object>> shelvesInfo = shelves.stream().map(shelf -> {
                    Map<String, Object> shelfInfo = new HashMap<>();
                    shelfInfo.put("shelfIdx", shelf.getShelfIdx());
                    shelfInfo.put("rackId", shelf.getRackId());
                    shelfInfo.put("shelfId", shelf.getShelfId());
                    return shelfInfo;
                }).collect(Collectors.toList());
                result.put("shelves", shelvesInfo);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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
//    	System.out.println(shelves); 
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
    


}
