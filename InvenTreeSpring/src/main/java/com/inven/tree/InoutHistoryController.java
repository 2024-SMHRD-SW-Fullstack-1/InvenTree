package com.inven.tree;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private StocksMapper stocksMapper;

    @Autowired
    private ReleasesMapper releasesMapper;

    // 재고 및 출고 기록을 가져오는 메서드
    @GetMapping("/stockEntries")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getStockAndReleaseEntries(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filterColumn,
            @RequestParam(required = false) String filterValue,
            @RequestParam String corpIdx) {

    	// 재고 및 출고 데이터를 합쳐서 날짜 순으로 정렬
        try {
            List<Map<String, Object>> stockEntries = stocksMapper.selectStocksWithDetailsFiltered(0, Integer.MAX_VALUE, filterColumn, filterValue, corpIdx);
            List<Map<String, Object>> releaseEntries = releasesMapper.selectReleasesWithDetailsFiltered(0, Integer.MAX_VALUE, filterColumn, filterValue, corpIdx);
 
            List<Map<String, Object>> allEntries = new ArrayList<>();
            allEntries.addAll(stockEntries);
            allEntries.addAll(releaseEntries);
            allEntries.sort((a, b) -> ((String)b.get("date")).compareTo((String)a.get("date")));

            int totalEntries = allEntries.size(); // 전체 항목 수
            int totalPages = (int) Math.ceil((double) totalEntries / size);// 전체 페이지 수 계산
            int start = (page - 1) * size;// 시작 인덱스 계산
            int end = Math.min(start + size, totalEntries);// 종료 인덱스 계산

            // 페이지에 해당하는 데이터 추출
            List<Map<String, Object>> pagedEntries = new ArrayList<>();
            if (start < end) {
                pagedEntries = allEntries.subList(start, end);
            }
            
            // 결과를 맵에 저장
            Map<String, Object> result = new HashMap<>();
            result.put("entries", pagedEntries);
            result.put("totalEntries", totalEntries);
            result.put("totalPages", totalPages);
            
            
            return ResponseEntity.ok(result); // 결과 반환
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "An error occurred while processing your request");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}