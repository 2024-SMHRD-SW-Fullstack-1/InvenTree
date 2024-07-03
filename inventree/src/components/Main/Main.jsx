import React, { useState, useEffect, useCallback, useRef } from 'react';
import style from './Main.module.css';
import WarehouseLayout from '../WarehouseLayout/WarehouseLayout';
import InoutHistoryTable from './InoutHistoryTable';
import PieChart from '../Statistics/PieChart';
import MixChart from '../Statistics/MixChart';
import axios from 'axios';

const Main = () => {
  const today = new Date().toISOString().slice(0, 7); // 현재 날짜를 YYYY-MM 형식으로 저장
  const [entries, setEntries] = useState([]); // 입출고 내역 상태
  const [report, setReport] = useState(null); // 월별 보고서 상태
  const [weeklyStockCounts, setWeeklyStockCounts] = useState({}); // 주간 재고 수량 상태
  const corpIdx = localStorage.getItem('corpIdx'); // 회사 인덱스를 로컬 스토리지에서 가져옴
  const scrollContainerRef = useRef(null); // 스크롤 컨테이너 레퍼런스
  const scrollSpeed = 1; // 스크롤 속도 설정
  const [scrollDirection, setScrollDirection] = useState(null); // 스크롤 방향 상태

  // 입출고 내역을 가져오는 함수
  const fetchEntries = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8090/tree/api/stockEntries', {
        params: { corpIdx },
        withCredentials: true,
      });
      const { entries } = response.data;
      const mappedEntries = (entries || []).map((data) => ({
        ...data,
        type: data.isRelease === 'Y' ? '출고' : '입고',
        quantity: data.isRelease === 'Y' ? data.releaseCnt : data.stockCnt,
        date: data.date,
      }));
      setEntries(mappedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }, [corpIdx]);

  // 월별 보고서를 가져오는 함수
  const fetchReport = useCallback(
    async (yearMonth) => {
      const dateToFetch = yearMonth || today;
      const [year, month] = dateToFetch.split('-');
      try {
        const response = await axios.get(`http://localhost:8090/tree/api/report`, {
          params: { year, month, corpIdx, filterType: '', filterValue: '' },
          withCredentials: true,
        });
        if (response.data) {
          setReport(response.data);
          setWeeklyStockCounts(response.data.weeklyStockCount || {});
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        if (error.response && error.response.status === 403) {
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
      }
    },
    [corpIdx, today],
  );

  // 연간 보고서를 가져오는 함수
  const fetchYearlyReport = useCallback(
    async (year) => {
      try {
        const response = await axios.get(`http://localhost:8090/tree/api/report`, {
          params: { year, corpIdx, filterType: '', filterValue: '' },
          withCredentials: true,
        });
        const monthlyData = response.data.monthlyData || {};
        setWeeklyStockCounts(monthlyData);
      } catch (error) {
        console.error('Error fetching yearly report:', error);
      }
    },
    [corpIdx],
  );

  // 총 재고 수량 계산
  const totalStockCount = report ? Object.values(report.weeklyStockCount || {}).reduce((a, b) => a + b, 0) : 0;
  // 총 출고 수량 계산
  const totalReleaseCount = report ? Object.values(report.weeklyReleaseCount || {}).reduce((a, b) => a + b, 0) : 0;

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchEntries();
    fetchReport(today);
    const [year] = today.split('-');
    fetchYearlyReport(year);
  }, [fetchEntries, fetchReport, fetchYearlyReport, today]);

  // 스크롤 함수
  const scroll = () => {
    if (scrollContainerRef.current && scrollDirection) {
      const container = scrollContainerRef.current;
      if (scrollDirection === 'up') {
        container.scrollTop -= scrollSpeed;
      } else if (scrollDirection === 'down') {
        container.scrollTop += scrollSpeed;
      }
      requestAnimationFrame(scroll);
    }
  };

  // 스크롤 시작 함수
  const startScroll = (direction) => {
    setScrollDirection(direction);
    requestAnimationFrame(scroll);
  };

  // 스크롤 중지 함수
  const stopScroll = () => {
    setScrollDirection(null);
  };

  return (
    <div className={style.content}>
      {/* 창고 배치도 섹션 */}
      <div className={style.section}>
        <h2>창고 배치도</h2>
        <div className={style.warehouseContainer} ref={scrollContainerRef}>
          <div className={`${style.scrollZone} ${style.top}`} onMouseEnter={() => startScroll('up')} onMouseLeave={stopScroll} />
          <WarehouseLayout isReadOnly={true} shelvesPerPage={3} className={style.previewWarehouseLayout} />
          <div className={`${style.scrollZone} ${style.bottom}`} onMouseEnter={() => startScroll('down')} onMouseLeave={stopScroll} />
        </div>
      </div>
      {/* 입출고 내역 섹션 */}
      <div className={style.section}>
        <h2>입출고 내역</h2>
        <InoutHistoryTable entries={entries} />
      </div>
      {/* 통계 데이터 섹션 */}
      <div className={style.section}>
        <h2>통계 데이터</h2>
        <div className={style.chartContainer}>
          <PieChart
            className={style.pieChartContainer}
            totalStockCount={totalStockCount}
            totalReleaseCount={totalReleaseCount}
            showText={false}
          />
        </div>
      </div>
      {/* 월별 입출고 섹션 */}
      <div className={style.section}>
        <h2>월별 입출고</h2>
        <div className={style.mixChartContainer}>
          <MixChart data={weeklyStockCounts} />
        </div>
      </div>
    </div>
  );
};

export default Main;
