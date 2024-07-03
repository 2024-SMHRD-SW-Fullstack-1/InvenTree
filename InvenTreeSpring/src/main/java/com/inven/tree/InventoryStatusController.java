package com.inven.tree;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.ProductsMapper;
import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.mapper.WarehousesMapper;
import com.inven.tree.model.InventoryStatus;
import com.inven.tree.model.Products;
import com.inven.tree.model.Shelves;
import com.inven.tree.model.Warehouses;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://inventree.shop"}, allowCredentials = "true")
@RequestMapping("/api/inventoryStatus")
public class InventoryStatusController {

    @Autowired
    private ProductsMapper productsMapper;

    @Autowired
    private WarehousesMapper warehousesMapper;

    @Autowired
    private ShelvesMapper shelvesMapper;

    // 특정 회사의 재고 상태를 가져오는 메서드
    @GetMapping("/{corpIdx}")
    public ResponseEntity<List<InventoryStatus>> getInventoryStatus(@PathVariable String corpIdx) {
        try {
            List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx); // 회사의 제품 목록 조회
            List<Warehouses> warehouses = warehousesMapper.selectAllWarehouses(corpIdx); // 회사의 모든 창고 목록 조회
            List<Shelves> shelves = shelvesMapper.selectAllShelves(); // 모든 선반 목록 조회

            // 제품 목록을 순회하며 재고 상태를 설정
            List<InventoryStatus> inventoryStatusList = products.stream().filter(product -> product != null) // null 제외
                    .map(product -> {
                        InventoryStatus status = new InventoryStatus();
                        status.setProdIdx(product.getProdIdx());
                        status.setProdBarcode(product.getProdBarcode());
                        status.setProdName(product.getProdName());
                        status.setProdCnt(product.getProdCnt());
                        status.setProdInfo(product.getProdInfo());

                        // 제품에 해당하는 창고와 선반 정보 설정
                        Warehouses warehouse = warehouses.stream().filter(w -> w.getWhIdx().equals(product.getWhIdx()))
                                .findFirst().orElse(null);
                        Shelves shelf = shelves.stream().filter(s -> s.getShelfIdx().equals(product.getShelfIdx()))
                                .findFirst().orElse(null);

                        if (warehouse != null) {
                            status.setBidlName(warehouse.getBidlName());
                            status.setWhIdx(warehouse.getWhIdx());
                        }
                        if (shelf != null) {
                            status.setShelfId(shelf.getShelfId());
                            status.setShelfIdx(shelf.getShelfIdx());
                            status.setRackId(shelf.getRackId());
                        }
                        return status;
                    }).collect(Collectors.toList());

            return ResponseEntity.ok(inventoryStatusList); // 재고 상태 목록 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 오류 발생 시 500 상태 반환
        }
    }

    // 제품 정보를 저장하는 메서드
    @PostMapping("/save")
    public ResponseEntity<Void> saveProducts(@RequestBody List<InventoryStatus> inventoryStatusList) {
        try {
            for (InventoryStatus status : inventoryStatusList) {
                Products product = convertToProducts(status);
                if (status.getProdIdx() != 0) { // prodIdx가 0이 아닌 경우 업데이트
                    productsMapper.updateProductSelective(product);
                } else { // prodIdx가 0인 경우 새로 삽입
                    productsMapper.insertProduct(product);
                }
            }
            return ResponseEntity.ok().build(); // 성공 시 200 상태 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 오류 발생 시 500 상태 반환
        }
    }

    // InventoryStatus 객체를 Products 객체로 변환하는 메서드
    private Products convertToProducts(InventoryStatus status) {
        Products product = new Products();
        product.setProdIdx(status.getProdIdx());
        product.setProdBarcode(status.getProdBarcode());
        product.setProdName(status.getProdName());
        product.setProdCnt(status.getProdCnt());
        product.setProdInfo(status.getProdInfo());
        product.setWhIdx(status.getWhIdx());
        product.setShelfIdx(status.getShelfIdx());
        product.setRackId(status.getRackId());
        product.setCorpIdx(status.getCorpIdx());
        return product;
    }

    // 삭제 엔드포인트 추가
    @DeleteMapping("/product/{prodIdx}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int prodIdx) {
        try {
            productsMapper.deleteProduct(prodIdx); // 제품 삭제
            return ResponseEntity.ok().build();// 성공 시 200 상태 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // 오류 발생 시 500 상태 반환
        }
    }
}
