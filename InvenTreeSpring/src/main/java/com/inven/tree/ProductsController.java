package com.inven.tree;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inven.tree.mapper.ProductsMapper;
import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.mapper.SubsidiariesMapper;
import com.inven.tree.model.Products;
import com.inven.tree.model.Subsidiaries;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://inventree.shop"}, allowCredentials = "true")
@RequestMapping("/api/products")
public class ProductsController {

    @Autowired
    private ProductsMapper productsMapper;
    @Autowired
    private ReleasesMapper releaseMapper;
    @Autowired
    private SubsidiariesMapper subsidiaryMapper;

    // 특정 회사의 모든 제품을 가져오는 엔드포인트
    @GetMapping("/{corpIdx}")
    public ResponseEntity<List<Products>> getProductsByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // 특정 회사의 입고된 거래처를 가져오는 엔드포인트
    @GetMapping("/subsidiaries/incoming/{corpIdx}")
    public ResponseEntity<List<Subsidiaries>> getIncomingSubsidiariesByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Subsidiaries> subsidiaries = subsidiaryMapper.selectIncomingSubsidiariesByCorpIdx(corpIdx);
            return ResponseEntity.ok(subsidiaries);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // 특정 회사의 출고된 거래처를 가져오는 엔드포인트
    @GetMapping("/subsidiaries/outgoing/{corpIdx}")
    public ResponseEntity<List<Subsidiaries>> getOutgoingSubsidiariesByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Subsidiaries> subsidiaries = subsidiaryMapper.selectOutgoingSubsidiariesByCorpIdx(corpIdx);
            return ResponseEntity.ok(subsidiaries);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // 제품을 입고하는 엔드포인트
    @PostMapping("/stock")
    public ResponseEntity<String> stockProducts(@RequestBody Map<String, Object> requestData) {
        try {
            List<Map<String, Object>> productsList = (List<Map<String, Object>>) requestData.get("productsList");
            Integer subIdx = (Integer) requestData.get("subIdx");

            if (subIdx == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Subsidiary index not provided");
            }

            for (Map<String, Object> productData : productsList) {
                String prodBarcode = (String) productData.get("prodBarcode");
                String corpIdx = (String) productData.get("corpIdx");
                Integer prodCnt = (Integer) productData.get("prodCnt");

                // 바코드를 이용해 제품 인덱스 조회
                Integer prodIdx = productsMapper.selectProdIdxByBarcode(prodBarcode);
                if (prodIdx == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Product not found for barcode: " + prodBarcode);
                }

                // 제품 입고 및 수량 업데이트
                productsMapper.insertStock(corpIdx, prodIdx, prodCnt, new Timestamp(System.currentTimeMillis()), subIdx);
                productsMapper.updateProductCount(prodIdx, prodCnt);
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error stocking products");
        }
    }

    // 제품을 출고하는 엔드포인트
    @PostMapping("/release")
    public ResponseEntity<String> releaseProducts(@RequestBody List<Map<String, Object>> productsList) {
        try {
            for (Map<String, Object> productData : productsList) {
                String prodBarcode = (String) productData.get("prodBarcode");
                String corpIdx = (String) productData.get("corpIdx");
                Integer prodCnt = (Integer) productData.get("prodCnt");
                Integer subIdx = (Integer) productData.get("subIdx");

                if (prodBarcode == null || corpIdx == null || prodCnt == null || subIdx == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Missing required fields in product data");
                }

                // 바코드를 이용해 제품 인덱스 조회
                Integer prodIdx = productsMapper.selectProdIdxByBarcode(prodBarcode);
                if (prodIdx == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Product not found for barcode: " + prodBarcode);
                }

                // 제품 출고 및 수량 업데이트
                releaseMapper.insertRelease(corpIdx, prodIdx, prodCnt, new Timestamp(System.currentTimeMillis()), subIdx);
                productsMapper.updateProductCount(prodIdx, -prodCnt);
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error releasing products");
        }
    }

    // 특정 회사의 모든 제품을 조회하는 엔드포인트 (쿼리 파라미터 사용)
    @GetMapping("/by-company")
    public ResponseEntity<List<Products>> getProductsByCompany(@RequestParam("corpIdx") String corpIdx) {
        try {
            List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
    // 특정 제품을 업데이트하는 엔드포인트
    @PutMapping("/{prodIdx}")
    public ResponseEntity<String> updateProduct(@PathVariable int prodIdx, @RequestBody Products product) {
        try {
            product.setProdIdx(prodIdx);
            productsMapper.updateProductSelective(product);
            return ResponseEntity.ok("Product updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating product");
        }
    }

    // 특정 제품을 삭제하는 엔드포인트
    @DeleteMapping("/{prodIdx}")
    public ResponseEntity<String> deleteProduct(@PathVariable int prodIdx) {
        try {
            productsMapper.deleteProduct(prodIdx);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting product");
        }
    }

    // 새로운 제품을 추가하는 엔드포인트
    @PostMapping
    public ResponseEntity<String> addProduct(@RequestBody Products product) {
        try {
            productsMapper.insertProduct(product);
            return ResponseEntity.ok("Product added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding product");
        }
    }
}
