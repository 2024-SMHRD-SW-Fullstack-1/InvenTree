package com.inven.tree;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.inven.tree.mapper.ProductsMapper;
import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.mapper.StocksMapper;
import com.inven.tree.mapper.SubsidiariesMapper;
import com.inven.tree.model.Products;
import com.inven.tree.model.Releases;
import com.inven.tree.model.Stocks;

@Controller
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api")
public class ReportController {

    @Autowired
    private StocksMapper stocksMapper;

    @Autowired
    private ReleasesMapper releasesMapper;

    @Autowired
    private ProductsMapper productsMapper;

    @Autowired
    private SubsidiariesMapper subsidiariesMapper;

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getReport(
        @RequestParam("year") int year, 
        @RequestParam(value = "month", required = false) Integer month,
        @RequestParam("filterType") String filterType,
        @RequestParam("filterValue") String filterValue,
        HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Received report request with year: " + year + ", month: " + month + ", filterType: " + filterType + ", filterValue: " + filterValue);

            String corpIdx = (String) session.getAttribute("corpIdx");
            if (corpIdx == null) {
                response.put("error", "세션이 만료되었습니다. 다시 로그인해주세요.");
                return ResponseEntity.status(403).body(response);
            }

            response.put("corpIdx", corpIdx);

            if (month == null) {
                Map<Integer, Map<String, Object>> monthlyData = new HashMap<>();
                for (int i = 1; i <= 12; i++) {
                    monthlyData.put(i, getMonthlyData(year, i, filterType, filterValue, corpIdx));
                }
                response.put("monthlyData", monthlyData);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> monthlyReport = getMonthlyData(year, month, filterType, filterValue, corpIdx);
                return ResponseEntity.ok(monthlyReport);
            }
        } catch (Exception e) {
            response.put("error", "예상치 못한 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private Map<String, Object> getMonthlyData(int year, int month, String filterType, String filterValue, String corpIdx) {
        WeekFields weekFields = WeekFields.of(java.util.Locale.getDefault());
        Map<String, Object> monthlyReport = new HashMap<>();
        
        try {
            Map<Integer, Integer> weeklyStockCount = new HashMap<>();
            Map<Integer, Integer> weeklyReleaseCount = new HashMap<>();
            Map<Integer, Double> avgWeeklyStockCount = new HashMap<>();
            Map<Integer, Double> avgWeeklyReleaseCount = new HashMap<>();

            IntStream.rangeClosed(1, 5).forEach(week -> {
                List<Stocks> weeklyStocks = stocksMapper.selectAllStocks().stream()
                    .filter(stock -> {
                        LocalDateTime date = LocalDateTime.parse(stock.getStockedAt(), formatter);
                        return date.getYear() == year && date.getMonthValue() == month && date.get(weekFields.weekOfMonth()) == week;
                    })
                    .collect(Collectors.toList());

                if (filterType.equals("productCode") || filterType.equals("productName") || filterType.equals("company")) {
                    List<Products> products = productsMapper.selectProductsByFilter(filterType, filterValue);
                    List<Integer> prodIdxList = products.stream().map(Products::getProdIdx).collect(Collectors.toList());
                    weeklyStocks = weeklyStocks.stream()
                        .filter(stock -> prodIdxList.contains(stock.getProdIdx()))
                        .collect(Collectors.toList());
                }

                List<Releases> weeklyReleases = releasesMapper.selectAllReleases().stream()
                    .filter(release -> {
                        LocalDateTime date = LocalDateTime.parse(release.getReleasedAt(), formatter);
                        return date.getYear() == year && date.getMonthValue() == month && date.get(weekFields.weekOfMonth()) == week;
                    })
                    .collect(Collectors.toList());

                int totalStockCount = weeklyStocks.stream().mapToInt(Stocks::getStockCnt).sum();
                int totalReleaseCount = weeklyReleases.stream().mapToInt(Releases::getReleaseCnt).sum();
                double avgStockCount = weeklyStocks.stream().mapToInt(Stocks::getStockCnt).average().orElse(0.0);
                double avgReleaseCount = weeklyReleases.stream().mapToInt(Releases::getReleaseCnt).average().orElse(0.0);

                weeklyStockCount.put(week, totalStockCount);
                weeklyReleaseCount.put(week, totalReleaseCount);
                avgWeeklyStockCount.put(week, avgStockCount);
                avgWeeklyReleaseCount.put(week, avgReleaseCount);
            });

            monthlyReport.put("weeklyStockCount", weeklyStockCount);
            monthlyReport.put("weeklyReleaseCount", weeklyReleaseCount);
            monthlyReport.put("avgWeeklyStockCount", avgWeeklyStockCount);
            monthlyReport.put("avgWeeklyReleaseCount", avgWeeklyReleaseCount);
        } catch (Exception e) {
            monthlyReport.put("error", "보고서 생성 중 오류가 발생했습니다: " + e.getMessage());
        }

        return monthlyReport;
    }
    
    @GetMapping("/filterList")
    public ResponseEntity<Map<String, Object>> getFilterList(@RequestParam("filterColumn") String filterColumn, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            String corpIdx = (String) session.getAttribute("corpIdx");
            if (corpIdx == null) {
                response.put("error", "세션이 만료되었습니다. 다시 로그인해주세요.");
                response.put("step", "Session Check");
                return ResponseEntity.status(403).body(response);
            }

            List<String> filterList;
            if (filterColumn.equals("company")) {
                filterList = subsidiariesMapper.selectDistinctByColumnAndCorpIdx("sub_name", corpIdx);
            } else {
                filterList = productsMapper.selectDistinctByColumnAndCorpIdx(filterColumn, corpIdx);
            }

            response.put("filterList", filterList);
            response.put("message", "Filter list fetched successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "필터 목록을 가져오는 중 오류가 발생했습니다: " + e.getMessage());
            response.put("step", "Filter List Fetching");
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/dailyReport")
    public ResponseEntity<Map<String, Object>> getDailyReport(@RequestParam("year") int year, 
                                                              @RequestParam("month") int month,
                                                              @RequestParam(value = "productName", required = false) String productName,
                                                              HttpSession session) {
        try {
            String corpIdx = (String) session.getAttribute("corpIdx");
            if (corpIdx == null) {
                return ResponseEntity.status(403).body(null);
            }

            AtomicReference<Integer> prodIdx = new AtomicReference<>(null);
            if (productName != null && !productName.trim().isEmpty()) {
                Products product = productsMapper.selectProductByName(productName);
                if (product == null) {
                    return ResponseEntity.status(404).body(null);
                }
                prodIdx.set(product.getProdIdx());
            }

            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());

            Map<Integer, Integer> dailyStockCount = new HashMap<>();
            Map<Integer, Integer> dailyReleaseCount = new HashMap<>();

            IntStream.rangeClosed(1, endDate.getDayOfMonth()).forEach(day -> {
                List<Stocks> dailyStocks = stocksMapper.selectAllStocks().stream()
                    .filter(stock -> {
                        LocalDateTime date = LocalDateTime.parse(stock.getStockedAt(), formatter);
                        boolean matchesDate = date.toLocalDate().equals(startDate.withDayOfMonth(day));
                        boolean matchesProduct = (prodIdx.get() == null) || (stock.getProdIdx() == prodIdx.get());
                        boolean matchesCorp = stock.getCorpIdx().equals(corpIdx);
                        return matchesDate && matchesProduct && matchesCorp;
                    })
                    .collect(Collectors.toList());
                List<Releases> dailyReleases = releasesMapper.selectAllReleases().stream()
                    .filter(release -> {
                        LocalDateTime date = LocalDateTime.parse(release.getReleasedAt(), formatter);
                        boolean matchesDate = date.toLocalDate().equals(startDate.withDayOfMonth(day));
                        boolean matchesProduct = (prodIdx.get() == null) || (release.getProdIdx() == prodIdx.get());
                        boolean matchesCorp = release.getCorpIdx().equals(corpIdx);
                        return matchesDate && matchesProduct && matchesCorp;
                    })
                    .collect(Collectors.toList());

                int totalStockCount = dailyStocks.stream().mapToInt(Stocks::getStockCnt).sum();
                int totalReleaseCount = dailyReleases.stream().mapToInt(Releases::getReleaseCnt).sum();

                dailyStockCount.put(day, totalStockCount);
                dailyReleaseCount.put(day, totalReleaseCount);
            });

            Map<String, Object> dailyReport = new HashMap<>();
            dailyReport.put("dailyStockCount", dailyStockCount);
            dailyReport.put("dailyReleaseCount", dailyReleaseCount);

            return ResponseEntity.ok(dailyReport);
        } catch (Exception e) {
            logger.error("Error generating daily report", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/productsByCorp")
    public ResponseEntity<List<String>> getProductsByCorp(HttpSession session) {
        try {
            String corpIdx = (String) session.getAttribute("corpIdx");
            if (corpIdx == null) {
                return ResponseEntity.status(403).body(null);
            }
            List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx);
            List<String> productNames = products.stream().map(Products::getProdName).collect(Collectors.toList());
            return ResponseEntity.ok(productNames);
        } catch (Exception e) {
            logger.error("Error fetching products by corp", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/productDetail")
    public ResponseEntity<Map<String, Object>> getProduct(@RequestParam("filterType") String filterType,
                                                          @RequestParam("filterValue") String filterValue) {
        Map<String, Object> response = new HashMap<>();
        try {
            Products product;
            if (filterType.equals("productCode")) {
                int prodIdx = Integer.parseInt(filterValue);
                product = productsMapper.selectProductById(prodIdx);
            } else if (filterType.equals("productName")) {
                product = productsMapper.selectProductByName(filterValue);
            } else {
                throw new IllegalArgumentException("Invalid filter type");
            }
            
            if (product == null) {
                response.put("error", "Product not found");
                return ResponseEntity.status(404).body(response);
            }
            
            response.put("prodCnt", product.getProdCnt());
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            response.put("error", "Invalid product code format");
            return ResponseEntity.status(400).body(response);
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (Exception e) {
            response.put("error", "Error fetching product information: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}