package com.inven.tree;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/warehouse")
    public List<Map<String, Object>> selectAllWarehouses(@RequestParam("corpIdx") String corpIdx) {
        System.out.println(corpIdx); // CorpIdx 잘 가져옴
        try {
            // 회사 식별자를 이용하여 창고 리스트를 가져옴
            List<Warehouses> warehouses = warehousesMapper.selectAllWarehouses(corpIdx);
//            System.out.println("창고 리스트: " + warehouses);

            // 모든 선반 리스트를 가져옴
            List<Shelves> shelves = shelvesMapper.selectAllShelves();
//            System.out.println("선반 리스트: " + shelves);

            // 결과를 담을 리스트 생성
            List<Map<String, Object>> result = new ArrayList<>();

            // 각 창고에 대해
            for (Warehouses warehouse : warehouses) {
                // 해당 창고에 속하는 선반 리스트를 필터링
                List<Shelves> filteredShelves = shelves.stream()
                        .filter(shelf -> shelf.getWhIdx().equals(warehouse.getWhIdx()))
                        .collect(Collectors.toList());

                // 창고 정보를 맵에 추가
                Map<String, Object> warehouseInfo = new HashMap<>();
                warehouseInfo.put("whIdx", warehouse.getWhIdx());
                warehouseInfo.put("bidlName", warehouse.getBidlName());
                warehouseInfo.put("mbId", warehouse.getMbId());
                warehouseInfo.put("whAddr", warehouse.getWhAddr());
                warehouseInfo.put("whStatus", warehouse.getWhStatus());

                // 선반 데이터가 있는 경우에만 선반 정보를 맵에 추가
                if (!filteredShelves.isEmpty()) {
                    List<Map<String, Object>> shelvesInfo = new ArrayList<>();
                    for (Shelves shelf : filteredShelves) {
                        Map<String, Object> shelfInfo = new HashMap<>();
                        shelfInfo.put("shelfIdx", shelf.getShelfIdx());
                        shelfInfo.put("rackId", shelf.getRackId());
                        shelfInfo.put("shelfId", shelf.getShelfId());
                        shelvesInfo.add(shelfInfo);
                    }
                    warehouseInfo.put("shelves", shelvesInfo);
                }

                // 결과 리스트에 추가
                result.add(warehouseInfo);
            }

//            System.out.println("결과 리스트: " + result);

            // 결과 리스트 반환
            return result;
        } catch (Exception e) {
            // 예외 발생 시 로그 출력 및 빈 리스트 반환
            System.out.println("실패");
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    @Transactional // 트랜잭션 관리 추가
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteWarehousesAndShelves(
            @RequestParam(value = "warehouseIdsToDelete", required = false, defaultValue = "") String whIds,
            @RequestParam(value = "shelfIdsToDelete", required = false, defaultValue = "") String shelfIds) {
        List<Integer> warehouseIdsToDelete = new ArrayList<>();
        List<Integer> shelfIdsToDelete = new ArrayList<>();

        try {
            if (!whIds.isEmpty()) {
                warehouseIdsToDelete = Arrays.asList(whIds.split(",")).stream()
                        .map(Integer::parseInt)
                        .collect(Collectors.toList());
                System.out.println("Warehouse IDs to delete: " + warehouseIdsToDelete);
            } else {
                System.out.println("오류1: warehouseIdsToDelete is empty");
            }

            if (!shelfIds.isEmpty()) {
                shelfIdsToDelete = Arrays.asList(shelfIds.split(",")).stream()
                        .map(Integer::parseInt)
                        .collect(Collectors.toList());
                System.out.println("Shelf IDs to delete: " + shelfIdsToDelete);
            } else {
                System.out.println("오류2: shelfIdsToDelete is empty");
            }

            // 선반 데이터 삭제
            if (!shelfIdsToDelete.isEmpty()) {
                shelvesMapper.deleteShelves(shelfIdsToDelete);
                System.out.println("Shelves deleted: " + shelfIdsToDelete);
            } else {
                System.out.println("오류3: No shelf IDs to delete");
            }

            // 삭제 후 선반 데이터가 있는지 확인
            List<Shelves> shelvesExist = shelvesMapper.selectAllShelves();
            System.out.println("Existing Shelves after deletion: " + shelvesExist);

            // 선반 데이터가 없는 경우에만 창고 삭제
            if (shelvesExist.isEmpty()) {
                if (!warehouseIdsToDelete.isEmpty()) {
                    warehousesMapper.deleteWarehouses(warehouseIdsToDelete);
                    System.out.println("Warehouses deleted: " + warehouseIdsToDelete);
                } else {
                    System.out.println("오류4: No warehouse IDs to delete");
                }
                return ResponseEntity.ok("창고 및 선반 삭제 성공");
            } else {
                System.out.println("창고 삭제 안함: 선반 데이터가 존재함");
                return ResponseEntity.badRequest().body("선반 데이터가 존재하여 창고를 삭제할 수 없습니다.");
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("잘못된 형식의 ID가 전달되었습니다: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("창고 및 선반 삭제 중 오류 발생: " + e.getMessage());
        }
    }

 
    @PutMapping("/warehouse/update/{whIdx}")
    public ResponseEntity<String> updateWarehouse(
            @PathVariable Integer whIdx,
            @RequestParam("corpIdx") String corpIdx,
            @RequestBody Warehouses warehouse) {

        try {
            // 기존 창고 정보 업데이트
            warehouse.setWhIdx(whIdx); // 업데이트할 창고의 식별자 설정
            warehouse.setCorpIdx(corpIdx); // 회사 코드 설정
            warehousesMapper.updateWarehouses(warehouse); // 창고 정보 업데이트

            // 기존 선반 정보 업데이트 또는 추가
            for (Shelves shelf : shelvesMapper.selectAllShelves()) {
                shelf.setWhIdx(whIdx); // 창고 ID 설정
                shelvesMapper.updateOrInsertShelves(shelf); // 선반 정보 업데이트 또는 추가
            }

            return ResponseEntity.ok("창고 정보 및 선반 정보 업데이트 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("창고 정보 및 선반 정보 업데이트 중 오류 발생: " + e.getMessage());
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


}
