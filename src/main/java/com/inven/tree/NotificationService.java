package com.inven.tree;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.mapper.StocksMapper;
import com.inven.tree.model.Releases;
import com.inven.tree.model.Stocks;

@Service
public class NotificationService {

    private static final double THRESHOLD_PERCENTAGE = 0.15; // 15%로 설정

    @Autowired
    private ReleasesMapper releasesMapper;

    @Autowired
    private StocksMapper stocksMapper;

    private int getTotalStockCount(String corpIdx) {
        List<Stocks> allStocks = stocksMapper.findStocksByCorpIdx(corpIdx);

        // allStocks가 null인 경우 빈 리스트로 초기화
        if (allStocks == null) {
            allStocks = Collections.emptyList();
        }

        return allStocks.stream().filter(s -> s != null).mapToInt(Stocks::getStockCnt).sum();
    }

    private int getTotalReleaseCount(String corpIdx) {
        List<Releases> allReleases = releasesMapper.findReleasesByCorpIdx(corpIdx);

        // allReleases가 null인 경우 빈 리스트로 초기화
        if (allReleases == null) {
            allReleases = Collections.emptyList();
        }

        return allReleases.stream().filter(r -> r != null).mapToInt(Releases::getReleaseCnt).sum();
    }

    private int calculateStockThreshold(String corpIdx) {
        int totalStockCount = getTotalStockCount(corpIdx);
        return (int) (totalStockCount * THRESHOLD_PERCENTAGE);
    }

    private int calculateReleaseThreshold(String corpIdx) {
        int totalReleaseCount = getTotalReleaseCount(corpIdx);
        return (int) (totalReleaseCount * THRESHOLD_PERCENTAGE);
    }

    public String checkForBulkEntries(String corpIdx) {
        List<Releases> releases = releasesMapper.findTodayReleasesByCorpIdx(corpIdx);
        List<Stocks> stocks = stocksMapper.findTodayStocksByCorpIdx(corpIdx);

        // releases와 stocks가 null인 경우 빈 리스트로 초기화
        if (releases == null) {
            releases = Collections.emptyList();
        }
        if (stocks == null) {
            stocks = Collections.emptyList();
        }

        int totalReleased = releases.stream().filter(r -> r != null).mapToInt(Releases::getReleaseCnt).sum();
        int totalStocked = stocks.stream().filter(s -> s != null).mapToInt(Stocks::getStockCnt).sum();

        int stockThreshold = calculateStockThreshold(corpIdx);
        int releaseThreshold = calculateReleaseThreshold(corpIdx);

        StringBuilder notifications = new StringBuilder();

        if (totalReleased > releaseThreshold) {
            notifications.append("대량 출고 알림: 오늘 총 ").append(totalReleased).append("개의 제품이 출고되었습니다.\n");
        }
        if (totalStocked > stockThreshold) {
            notifications.append("대량 입고 알림: 오늘 총 ").append(totalStocked).append("개의 제품이 입고되었습니다.\n");
        }
        return notifications.toString();
    }

    public String checkForAbnormalStockChanges(String corpIdx) {
        List<Stocks> stocks = stocksMapper.findTodayStocksByCorpIdx(corpIdx);

        // stocks가 null인 경우 빈 리스트로 초기화
        if (stocks == null) {
            stocks = Collections.emptyList();
        }

        int stockThreshold = calculateStockThreshold(corpIdx);

        StringBuilder notifications = new StringBuilder();

        for (Stocks stock : stocks) {
            if (stock != null && stock.getStockCnt() < stockThreshold) {
                notifications.append("비정상적 재고 변동 알림: 제품 ").append(stock.getProdIdx()).append("의 재고량이 ")
                        .append(stock.getStockCnt()) // 실제 재고량 표시
                        .append("개로 ").append(stockThreshold).append("개 이하로 떨어졌습니다.\n");
            }
        }

        return notifications.toString();
    }

    public String checkForSignificantStockChanges(String corpIdx) {
        List<Stocks> stockChanges = stocksMapper.findTopStockChanges(corpIdx);

        // stockChanges가 null인 경우 빈 리스트로 초기화
        if (stockChanges == null) {
            stockChanges = Collections.emptyList();
        }

        if (stockChanges.isEmpty()) {
            return "재고 변동 상위 품목 알림: 오늘 재고 변동이 없습니다.";
        }

        List<Stocks> topChanges = stockChanges.stream().filter(s -> s != null).limit(3).collect(Collectors.toList());

        StringBuilder notifications = new StringBuilder();
        notifications.append("재고 변동 상위 품목 알림: ");

        for (Stocks stock : topChanges) {
            notifications.append(stock.getProdIdx())
                .append(" (변동: ")
                .append(stock.getStockCnt())
                .append("개), ");
        }

        // 마지막 쉼표 및 공백 제거
        if (notifications.length() > 0) {
            notifications.setLength(notifications.length() - 2);
        }

        return notifications.toString();
    }

    public List<Map<String, String>> generateNotifications(String corpIdx) {
        List<Map<String, String>> notifications = new ArrayList<>();

        String bulkEntryNotifications = checkForBulkEntries(corpIdx);
        String stockChangesNotifications = checkForSignificantStockChanges(corpIdx);
        String abnormalStockChangesNotifications = checkForAbnormalStockChanges(corpIdx);

        notifications.add(Map.of("type", "대량 입출고", "message", bulkEntryNotifications));
        notifications.add(Map.of("type", "재고 변동 상위 품목", "message", stockChangesNotifications));
        notifications.add(Map.of("type", "비정상적 재고 변동", "message", abnormalStockChangesNotifications));

        return notifications;
    }
}
