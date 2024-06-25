package com.inven.tree;

import java.util.ArrayList;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.mapper.StocksMapper;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InoutHistoryController {

    private static final Logger logger = LoggerFactory.getLogger(InoutHistoryController.class);

    @Autowired
    private StocksMapper stocksMapper;

    @Autowired
    private ReleasesMapper releasesMapper;

    @GetMapping("/stockEntries")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStockAndReleaseEntries(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filterColumn,
            @RequestParam(required = false) String filterValue) {

        logger.info("Received request with filterColumn: {}, filterValue: {}, page: {}, size: {}",
                    new Object[]{filterColumn, filterValue, page, size});

        try {
            List<Map<String, Object>> stockEntries = stocksMapper.selectStocksWithDetailsFiltered(0, Integer.MAX_VALUE, filterColumn, filterValue);
            List<Map<String, Object>> releaseEntries = releasesMapper.selectReleasesWithDetailsFiltered(0, Integer.MAX_VALUE, filterColumn, filterValue);

            logger.info("Stock Entries: {}", stockEntries);
            logger.info("Release Entries: {}", releaseEntries);

            List<Map<String, Object>> allEntries = new ArrayList<>();
            allEntries.addAll(stockEntries);
            allEntries.addAll(releaseEntries);
            allEntries.sort((a, b) -> ((String)b.get("date")).compareTo((String)a.get("date")));

            int totalEntries = allEntries.size();
            int totalPages = (int) Math.ceil((double) totalEntries / size);
            int start = (page - 1) * size;
            int end = Math.min(start + size, totalEntries);

            List<Map<String, Object>> pagedEntries = new ArrayList<>();
            if (start < end) {
                pagedEntries = allEntries.subList(start, end);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("entries", pagedEntries);
            result.put("totalEntries", totalEntries);
            result.put("totalPages", totalPages);

            logger.info("Returning result with {} entries", pagedEntries.size());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error occurred while fetching stock and release entries", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "An error occurred while processing your request");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
