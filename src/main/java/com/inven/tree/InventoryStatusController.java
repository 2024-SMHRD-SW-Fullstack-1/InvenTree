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
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/inventoryStatus")
public class InventoryStatusController {

    @Autowired
    private ProductsMapper productsMapper;

    @Autowired
    private WarehousesMapper warehousesMapper;

    @Autowired
    private ShelvesMapper shelvesMapper;

    @GetMapping("/{corpIdx}")
    public ResponseEntity<List<InventoryStatus>> getInventoryStatus(@PathVariable String corpIdx) {
        try {
            List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx);
            List<Warehouses> warehouses = warehousesMapper.selectAllWarehouses(corpIdx);
            List<Shelves> shelves = shelvesMapper.selectAllShelves();

            List<InventoryStatus> inventoryStatusList = products.stream().filter(product -> product != null) // null 제외
                    .map(product -> {
                        InventoryStatus status = new InventoryStatus();
                        status.setProdIdx(product.getProdIdx());
                        status.setProdBarcode(product.getProdBarcode());
                        status.setProdName(product.getProdName());
                        status.setProdCnt(product.getProdCnt());
                        status.setProdInfo(product.getProdInfo());

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

            return ResponseEntity.ok(inventoryStatusList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @PostMapping("/save")
    public ResponseEntity<Void> saveProducts(@RequestBody List<InventoryStatus> inventoryStatusList) {
        try {
            for (InventoryStatus status : inventoryStatusList) {
                Products product = convertToProducts(status);
                if (status.getProdIdx() != 0) { // int 타입은 null을 사용할 수 없으므로 0을 기본 값으로 사용
                    productsMapper.updateProductSelective(product);
                } else {
                    productsMapper.insertProduct(product);
                }
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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
            productsMapper.deleteProduct(prodIdx);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}