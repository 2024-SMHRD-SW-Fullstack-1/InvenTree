package com.inven.tree;

import java.sql.Timestamp;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.inven.tree.mapper.ProductsMapper;
import com.inven.tree.model.Products;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ProductsController {

    @Autowired
    private ProductsMapper productsMapper;
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
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error retrieving products", e);
            return ResponseEntity.status(500).body(null);
        }
    }
}
