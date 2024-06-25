package com.inven.tree;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.inven.tree.model.ProductImportData;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ImportController {

    @PostMapping("/excel/import")
    public ResponseEntity<List<ProductImportData>> importExcel(@RequestParam("file") MultipartFile file) throws IOException {
        List<ProductImportData> productList = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue; // Skip header row
                }

                ProductImportData data = new ProductImportData();

                // Product Barcode
                data.setProdBarcode(getCellValueAsString(row.getCell(0)));

                // Product Name
                data.setProdName(getCellValueAsString(row.getCell(1)));

                // Stock Count
                Cell cell = row.getCell(2);
                if (cell != null) {
                    if (cell.getCellType() == CellType.NUMERIC) {
                        data.setStockCnt((int) cell.getNumericCellValue());
                    } else {
                        try {
                            data.setStockCnt(Integer.parseInt(getCellValueAsString(cell)));
                        } catch (NumberFormatException e) {
                            data.setStockCnt(0); // 기본값 설정
                        }
                    }
                } else {
                    data.setStockCnt(0); // 기본값 설정
                }

                // Corporate Name
                data.setCorpName(getCellValueAsString(row.getCell(3)));

                productList.add(data);
            }
        }

        return ResponseEntity.ok(productList);
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}
