package com.inven.tree;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.inven.tree.mapper.ProductsMapper;
import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.mapper.SubsidiariesMapper;
import com.inven.tree.model.Products;
import com.inven.tree.model.Subsidiaries;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ProductsController {

    @Autowired
    private ProductsMapper productsMapper;
    @Autowired
    private ReleasesMapper releaseMapper;
    @Autowired
    private SubsidiariesMapper subsidiaryMapper;
    private static final Logger logger = LoggerFactory.getLogger(ProductsController.class);

    @GetMapping("/products/{corpIdx}")
    public ResponseEntity<List<Products>> getProductsByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/subsidiaries/incoming/{corpIdx}")
    public ResponseEntity<List<Subsidiaries>> getIncomingSubsidiariesByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Subsidiaries> subsidiaries = subsidiaryMapper.selectIncomingSubsidiariesByCorpIdx(corpIdx);
            return ResponseEntity.ok(subsidiaries);
        } catch (Exception e) {
            logger.error("Error retrieving subsidiaries", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/subsidiaries/outgoing/{corpIdx}")
    public ResponseEntity<List<Subsidiaries>> getOutgoingSubsidiariesByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Subsidiaries> subsidiaries = subsidiaryMapper.selectOutgoingSubsidiariesByCorpIdx(corpIdx);
            return ResponseEntity.ok(subsidiaries);
        } catch (Exception e) {
            logger.error("Error retrieving subsidiaries", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/stockProducts")
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

                logger.info("Processing product with barcode: {}", prodBarcode);

                Integer prodIdx = productsMapper.selectProdIdxByBarcode(prodBarcode);
                if (prodIdx == null) {
                    logger.error("Product not found for barcode: {}", prodBarcode);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not found for barcode: " + prodBarcode);
                }

                // 재고 정보를 stocks 테이블에 추가
                productsMapper.insertStock(corpIdx, prodIdx, prodCnt, new Timestamp(System.currentTimeMillis()), subIdx);
                logger.info("Inserted stock for product with barcode: {}", prodBarcode);

                // 제품 테이블의 제품 수량 업데이트
                productsMapper.updateProductCount(prodIdx, prodCnt);
                logger.info("Updated product count for product with barcode: {}", prodBarcode);
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            logger.error("Error stocking products", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error stocking products");
        }
    }

    @PostMapping("/releaseProducts")
    public ResponseEntity<String> releaseProducts(@RequestBody List<Map<String, Object>> productsList) {
        try {
            for (Map<String, Object> productData : productsList) {
                String prodBarcode = (String) productData.get("prodBarcode");
                String corpIdx = (String) productData.get("corpIdx");
                Integer prodCnt = (Integer) productData.get("prodCnt");
                Integer subIdx = (Integer) productData.get("subIdx");

                logger.info("Processing product with barcode: {}, corpIdx: {}, prodCnt: {}, subIdx: {}", prodBarcode, corpIdx);

                if (prodBarcode == null || corpIdx == null || prodCnt == null || subIdx == null) {
                    logger.error("Missing required fields in product data: {}", productData);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing required fields in product data");
                }

                Integer prodIdx = productsMapper.selectProdIdxByBarcode(prodBarcode);
                if (prodIdx == null) {
                    logger.error("Product not found for barcode: {}", prodBarcode);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product not found for barcode: " + prodBarcode);
                }

                // 재고 정보를 releases 테이블에 추가
                releaseMapper.insertRelease(corpIdx, prodIdx, prodCnt, new Timestamp(System.currentTimeMillis()), subIdx);
                logger.info("Inserted release for product with barcode: {}", prodBarcode);

                // 제품 테이블의 제품 수량 업데이트
                productsMapper.updateProductCount(prodIdx, -prodCnt);
                logger.info("Updated product count for product with barcode: {}", prodBarcode);
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            logger.error("Error releasing products", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error releasing products");
        }
    }
}
