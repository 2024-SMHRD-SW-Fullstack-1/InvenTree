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

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ImportController {

    // 엑셀 파일을 업로드하고 데이터를 가져오는 메서드
    @PostMapping("/excel/import")
    public ResponseEntity<List<ProductImportData>> importExcel(@RequestParam("file") MultipartFile file) {
        List<ProductImportData> productList = new ArrayList<>();
        try {
            try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);

                // 시트의 각 행을 순회하며 데이터를 파싱
                for (Row row : sheet) {
                    if (row.getRowNum() == 0) {
                        continue; // 헤더 행은 건너뜀
                    }

                    ProductImportData data = new ProductImportData();

                    // 엑셀에서 데이터를 파싱하여 객체에 설정
                    data.setProdBarcode(getCellValueAsString(row.getCell(0)));
                    data.setProdName(getCellValueAsString(row.getCell(1)));

                    Cell cell = row.getCell(2);
                    data.setStockCnt(parseStockCount(cell));
                    data.setCorpName(getCellValueAsString(row.getCell(3)));

                    productList.add(data); // 리스트에 객체 추가
                }
            }
            return ResponseEntity.ok(productList); // 파싱된 데이터를 반환
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing Excel file", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", e);
        }
    }
    
    // 더 많은 세부 정보를 포함하여 엑셀 파일을 업로드하고 데이터를 가져오는 메서드
    @PostMapping("/excel/importWithDetails")
    public ResponseEntity<List<ProductImportData>> importExcelWithDetails(@RequestParam("file") MultipartFile file) {
        List<ProductImportData> productList = new ArrayList<>();
        try {
            try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                Sheet sheet = workbook.getSheetAt(0);
                // 시트의 각 행을 순회하며 데이터를 파싱
                for (Row row : sheet) {
                    if (row.getRowNum() == 0) {
                        continue; // 헤더 행은 건너뜀
                    }
                    ProductImportData data = new ProductImportData();

                    // 엑셀에서 데이터를 파싱하여 객체에 설정
                    data.setProdBarcode(getCellValueAsString(row.getCell(0)));
                    data.setProdName(getCellValueAsString(row.getCell(1)));

                    Cell cell = row.getCell(2);
                    data.setStockCnt(parseStockCount(cell));
                    data.setCorpName(getCellValueAsString(row.getCell(3)));
                    data.setShelfId(getCellValueAsString(row.getCell(4))); // 추가
                    data.setRackId(getCellValueAsString(row.getCell(5))); // 추가
                    data.setProdInfo(getCellValueAsString(row.getCell(6))); // 추가

                    productList.add(data); // 리스트에 객체 추가
                }
            }
            return ResponseEntity.ok(productList);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing Excel file", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", e);
        }
    }
    
    // 셀에서 재고 수량을 파싱하는 메서드
    private int parseStockCount(Cell cell) {
        if (cell == null)
            return 0;
        if (cell.getCellType() == CellType.NUMERIC) {
            return (int) cell.getNumericCellValue();
        } else {
            try {
                return Integer.parseInt(getCellValueAsString(cell));
            } catch (NumberFormatException e) {
                return 0; // 파싱 실패 시 기본값 반환
            }
        }
    }
    
    // 셀의 값을 문자열로 변환하는 메서드
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
