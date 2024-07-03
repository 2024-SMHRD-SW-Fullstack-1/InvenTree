/**
 * @fileoverview 통계 차트를 표시하는 컴포넌트
 * 파이 차트와 혼합 차트를 포함합니다.
 */

import React from 'react';
import style from './Main.module.css';
import PieChart from '../Statistics/PieChart';
import MixChart from '../Statistics/MixChart';
import { useStatistics } from './StatisticsContext';

/**
 * StatisticsCharts 컴포넌트
 * @return {React.Component} 통계 차트 컴포넌트
 */
const StatisticsCharts = () => {
  // StatisticsContext에서 필요한 데이터 추출
  const { report, monthlyReport, totalStockCount, totalReleaseCount, productCount } = useStatistics();

  // 디버깅을 위한 콘솔 로그
  console.log('StatisticsCharts - report:', report);
  console.log('StatisticsCharts - monthlyReport:', monthlyReport);
  console.log('StatisticsCharts - totalStockCount:', totalStockCount);
  console.log('StatisticsCharts - totalReleaseCount:', totalReleaseCount);
  console.log('StatisticsCharts - productCount:', productCount);

  // 보고서 데이터가 없을 경우 로딩 메시지 표시
  if (!report) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={style.chartContainer}>
        {/* 파이 차트 컴포넌트 */}
        <PieChart
          className={style.pieChartContainer}
          totalStockCount={totalStockCount}
          totalReleaseCount={totalReleaseCount}
          productCount={productCount}
        />
        {/* 혼합 차트 컴포넌트 */}
        <MixChart className={style.barChartContainer} data={monthlyReport} />
      </div>
    </div>
  );
};

export default StatisticsCharts;
