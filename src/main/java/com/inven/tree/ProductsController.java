package com.inven.tree;

import java.sql.Timestamp;
import java.util.List;
<<<<<<< HEAD
import java.util.Map;
=======
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.http.HttpStatus;
=======
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.PathVariable;
=======
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.inven.tree.mapper.ProductsMapper;
<<<<<<< HEAD
import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.mapper.SubsidiaryMapper;
import com.inven.tree.model.Products;
import com.inven.tree.model.Subsidiary;
=======
import com.inven.tree.model.Products;
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ProductsController {

    @Autowired
    private ProductsMapper productsMapper;
<<<<<<< HEAD
    @Autowired
    private ReleasesMapper releaseMapper;
    @Autowired
    private SubsidiaryMapper subsidiaryMapper;
    private static final Logger logger = LoggerFactory.getLogger(ProductsController.class);

    @GetMapping("/products/{corpIdx}")
    public ResponseEntity<List<Products>> getProductsByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx);
=======
    private static final Logger logger = LoggerFactory.getLogger(ProductsController.class);

    @PostMapping("/stockProducts")
    public ResponseEntity<String> stockProducts(@RequestBody List<Products> products) {
        try {
            logger.info("Received request to stock products: {}", products);
            for (Products product : products) {
                logger.info("Processing product: {}", product);

                String corpIdx = productsMapper.selectCorpIdxByName(product.getCorpIdx());
                logger.info("Retrieved corpIdx: {}", corpIdx);
                if (corpIdx == null) {
                    logger.error("Corporation not found for corpIdx: {}", product.getCorpIdx());
                    return ResponseEntity.status(400).body("Corporation not found for corpIdx: " + product.getCorpIdx());
                }

                Integer prodIdx = productsMapper.selectProdIdxByBarcode(product.getProdBarcode());
                logger.info("Retrieved prodIdx: {}", prodIdx);
                if (prodIdx == null) {
                    logger.error("Product not found for barcode: {}", product.getProdBarcode());
                    return ResponseEntity.status(400).body("Product not found for barcode: " + product.getProdBarcode());
                }

                productsMapper.insertStock(corpIdx, prodIdx, product.getProdCnt(), new Timestamp(System.currentTimeMillis()));
                logger.info("Inserted stock for product: {}", product.getProdName());

                productsMapper.updateProductCount(prodIdx, product.getProdCnt());
                logger.info("Updated product count for product: {}", product.getProdName());
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            logger.error("Error stocking products", e);
            return ResponseEntity.status(500).body("Error stocking products");
        }
    }

    @PostMapping("/releaseProducts")
    public ResponseEntity<String> releaseProducts(@RequestBody List<Products> products) {
        try {
            logger.info("Received request to release products: {}", products);
            for (Products product : products) {
                logger.info("Processing product: {}", product);

                String corpIdx = productsMapper.selectCorpIdxByName(product.getCorpIdx());
                logger.info("Retrieved corpIdx: {}", corpIdx);
                if (corpIdx == null) {
                    logger.error("Corporation not found for corpIdx: {}", product.getCorpIdx());
                    return ResponseEntity.status(400).body("Corporation not found for corpIdx: " + product.getCorpIdx());
                }

                Integer prodIdx = productsMapper.selectProdIdxByBarcode(product.getProdBarcode());
                logger.info("Retrieved prodIdx: {}", prodIdx);
                if (prodIdx == null) {
                    logger.error("Product not found for barcode: {}", product.getProdBarcode());
                    return ResponseEntity.status(400).body("Product not found for barcode: " + product.getProdBarcode());
                }

                productsMapper.insertRelease(corpIdx, prodIdx, product.getProdCnt(), new Timestamp(System.currentTimeMillis()));
                logger.info("Inserted release for product: {}", product.getProdName());

                productsMapper.updateProductCount(prodIdx, -product.getProdCnt());
                logger.info("Updated product count for product: {}", product.getProdName());
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            logger.error("Error releasing products", e);
            return ResponseEntity.status(500).body("Error releasing products");
        }
    }

    @GetMapping("/products")
    public ResponseEntity<List<Products>> selectAllProducts() {
        try {
            List<Products> products = productsMapper.selectAllProducts();
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products", e);
            return ResponseEntity.status(500).body(null);
        }
    }
<<<<<<< HEAD

    @GetMapping("/subsidiaries/incoming/{corpIdx}")
    public ResponseEntity<List<Subsidiary>> getIncomingSubsidiariesByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Subsidiary> subsidiaries = subsidiaryMapper.selectIncomingSubsidiariesByCorpIdx(corpIdx);
            return ResponseEntity.ok(subsidiaries);
        } catch (Exception e) {
            logger.error("Error retrieving subsidiaries", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/subsidiaries/outgoing/{corpIdx}")
    public ResponseEntity<List<Subsidiary>> getOutgoingSubsidiariesByCorpIdx(@PathVariable String corpIdx) {
        try {
            List<Subsidiary> subsidiaries = subsidiaryMapper.selectOutgoingSubsidiariesByCorpIdx(corpIdx);
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
=======
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
}
