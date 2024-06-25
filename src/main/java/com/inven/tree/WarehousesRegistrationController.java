package com.inven.tree;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.mapper.WarehousesMapper;
import com.inven.tree.model.Shelves;
import com.inven.tree.model.Warehouses;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class WarehousesRegistrationController {

    @Autowired
    private WarehousesMapper warehousesMapper;
    
    @Autowired
    private ShelvesMapper shelvesMapper;
    
    @GetMapping("/warehouse") // 창고 등록 페이지 창고리스트
    public List<Warehouses> warehouse() {
        return warehousesMapper.allWarehouses();
    }
    
    @GetMapping("/shelf") // 창고 등록 페이지 선반 리스트
    public List<Shelves> shelf() {
        return shelvesMapper.allShelves();
    }

    // 창고 삭제 기능
    @Transactional //트랜잭션 관리 추가
    @DeleteMapping("/warehouse/delete/{ids}") 
    public ResponseEntity<String> deleteWarehouses(@PathVariable("ids") String ids) {
        List<Integer> idsToDelete = Arrays.stream(ids.split(","))
                                          .map(Integer::parseInt)
                                          .collect(Collectors.toList());
        System.out.println(idsToDelete);

        try {
        	System.out.println(idsToDelete);
        	shelvesMapper.deleteShelves(idsToDelete); // 선반 삭제 먼저 진행 
        	
            warehousesMapper.deleteWarehouses(idsToDelete); // 창고 테이블에서 데이터 삭제
            return ResponseEntity.ok("창고 삭제 성공");
        } catch (DataIntegrityViolationException dive) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("데이터 무결성 오류로 인해 창고를 삭제할 수 없습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("창고 삭제 중 오류 발생: " + e.getMessage());
        }
    }

//    // 창고 추가 기능
//    @PostMapping("/warehouse/add")
//    public ResponseEntity<?> addWarehouse(@RequestBody Warehouses warehouse) {
//        try {
//            warehousesMapper.addWarehouse(warehouse);
//            return new ResponseEntity<>("창고 추가 성공", HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>("창고 추가 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // 창고 정보 수정 기능
//    @PostMapping("/warehouse/update")
//    public ResponseEntity<?> updateWarehouse(@RequestBody Warehouses warehouse) {
//        try {
//            warehousesMapper.updateWarehouse(warehouse);
//            return new ResponseEntity<>("창고 정보 수정 성공", HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>("창고 정보 수정 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
}
