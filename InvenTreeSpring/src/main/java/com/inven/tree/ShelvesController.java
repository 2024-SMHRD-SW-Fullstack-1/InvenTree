package com.inven.tree;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import com.inven.tree.mapper.ProductsMapper;
import com.inven.tree.model.Products;
import com.inven.tree.model.Shelves;

@RestController
@RequestMapping("/api/shelves")
@CrossOrigin(origins = {"http://localhost:3000", "http://inventree.shop"}, allowCredentials = "true")
public class ShelvesController {
    @Autowired
    private ShelvesMapper shelvesMapper;

    @Autowired
    private ProductsMapper productsMapper;

    // 특정 창고 ID에 해당하는 선반 목록을 가져오는 GET 엔드포인트
    @GetMapping
    public ResponseEntity<List<Shelves>> getShelvesByWarehouseId(@RequestParam("wh_idx") int whIdx) {
        List<Shelves> shelves = shelvesMapper.findByWarehouseId(whIdx);
        return ResponseEntity.ok(shelves);
    }

    // 새로운 선반을 추가하는 POST 엔드포인트
    @PostMapping
    public ResponseEntity<Shelves> addShelf(@RequestBody Shelves shelf) {
        if (shelf.getShelfStatus() == null || (!shelf.getShelfStatus().equals("Y") && !shelf.getShelfStatus().equals("N"))) {
            shelf.setShelfStatus("N");
        }
        shelvesMapper.insertShelf(shelf);
        return ResponseEntity.ok(shelf);
    }

    // 특정 선반을 삭제하는 DELETE 엔드포인트
    @DeleteMapping("/{shelfId}")
    public ResponseEntity<Void> deleteShelf(@PathVariable("shelfId") int shelfId) {
        shelvesMapper.deleteShelf(shelfId);
        return ResponseEntity.noContent().build();
    }

    // 특정 선반에 새로운 랙을 추가하는 POST 엔드포인트
    @PostMapping("/{shelfIdx}/racks")
    public ResponseEntity<Shelves> addRack(@PathVariable("shelfIdx") int shelfIdx, @RequestBody Map<String, String> body) {
        Shelves shelf = shelvesMapper.findByShelfIdx(shelfIdx);
        if (shelf == null) {
            return ResponseEntity.notFound().build();
        }
        
        String newRackId = body.get("id");
        String currentRackId = shelf.getRackId();
        
        if (currentRackId == null || currentRackId.isEmpty()) {
            shelf.setRackId(newRackId);
        } else {
            shelf.setRackId(currentRackId + "," + newRackId);
        }
        
        shelvesMapper.updateShelf(shelf);
        
        return ResponseEntity.ok(shelf);
    }

    // 특정 선반 ID에 해당하는 선반 정보를 가져오는 GET 엔드포인트
    @GetMapping("/{shelfIdx}")
    public ResponseEntity<Shelves> getShelfById(@PathVariable("shelfIdx") int shelfIdx) {
        Shelves shelf = shelvesMapper.findByShelfIdx(shelfIdx);
        if (shelf == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(shelf);
    }

    // 특정 선반을 업데이트하는 PUT 엔드포인트
    @PutMapping("/{shelfIdx}")
    public ResponseEntity<Shelves> updateShelf(@PathVariable("shelfIdx") int shelfIdx, @RequestBody Shelves updatedShelf) {
        Shelves existingShelf = shelvesMapper.findByShelfIdx(shelfIdx);
        if (existingShelf == null) {
            return ResponseEntity.notFound().build();
        }
        
        updatedShelf.setShelfIdx(shelfIdx);
        shelvesMapper.updateShelf(updatedShelf);
        
        return ResponseEntity.ok(updatedShelf);
    }

    // 특정 선반과 랙에 제품을 추가하는 POST 엔드포인트
    @PostMapping("/{shelfIdx}/racks/{rackId}/product")
    public ResponseEntity<Void> addProductToRack(
        @PathVariable("shelfIdx") int shelfIdx,
        @PathVariable("rackId") String rackId,
        @RequestBody Products product
    ) {
        product.setShelfIdx(shelfIdx);
        product.setRackId(rackId);
        productsMapper.updateProduct(product);

        return ResponseEntity.noContent().build();
    }

    // 특정 선반 ID에 해당하는 모든 제품을 가져오는 GET 엔드포인트
    @GetMapping("/shelf-products")
    public ResponseEntity<List<Products>> getProductsByShelfIdx(@RequestParam("shelfIdx") int shelfIdx) {
        List<Products> products = productsMapper.selectProductsByShelfIdx(shelfIdx);
        return ResponseEntity.ok(products);
    }
}
