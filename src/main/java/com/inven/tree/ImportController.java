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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ImportController {

	private static final Logger logger = LoggerFactory.getLogger(ImportController.class);

	@PostMapping("/excel/import")
	public ResponseEntity<List<ProductImportData>> importExcel(@RequestParam("file") MultipartFile file) {
		List<ProductImportData> productList = new ArrayList<>();
		try {
			try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
				Sheet sheet = workbook.getSheetAt(0);

				for (Row row : sheet) {
					if (row.getRowNum() == 0) {
						continue; // Skip header row
					}

					ProductImportData data = new ProductImportData();

					// Parse and set properties from the excel
					data.setProdBarcode(getCellValueAsString(row.getCell(0)));
					data.setProdName(getCellValueAsString(row.getCell(1)));

					Cell cell = row.getCell(2);
					data.setStockCnt(parseStockCount(cell));
					data.setCorpName(getCellValueAsString(row.getCell(3)));

					productList.add(data);
				}
			}
			return ResponseEntity.ok(productList);
		} catch (IOException e) {
			logger.error("Error processing Excel file", e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing Excel file", e);
		} catch (Exception e) {
			logger.error("An unexpected error occurred", e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", e);
		}
	}

	private int parseStockCount(Cell cell) {
		if (cell == null)
			return 0;
		if (cell.getCellType() == CellType.NUMERIC) {
			return (int) cell.getNumericCellValue();
		} else {
			try {
				return Integer.parseInt(getCellValueAsString(cell));
			} catch (NumberFormatException e) {
				return 0; // Default value if parsing fails
			}
		}

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
