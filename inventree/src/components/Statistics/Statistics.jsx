import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import style from './Statistics.module.css';
import searchIcon from '../../assets/images/검색L.png';
import axios from 'axios';
import { FormControl, Select, MenuItem } from '@mui/material';
import MixChart from './MixChart';
import PieChart from './PieChart';

const Statistics = () => {
  const today = new Date().toISOString().slice(0, 7); // YYYY-MM 형식의 오늘 날짜
  const [yearMonth, setYearMonth] = useState(today);
  const [productName, setProductName] = useState('');
  const [report, setReport] = useState(null);
  const [selectedYearMonth, setSelectedYearMonth] = useState(today);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productList, setProductList] = useState([]);
  const [showProductList, setShowProductList] = useState(false);
  const [filterColumn, setFilterColumn] = useState('type');
  const [productCount, setProductCount] = useState(0);
  const [monthlyReport, setMonthlyReport] = useState({});

  const filterColumns = [
    { value: 'type', label: '구분' },
    { value: 'productCode', label: '제품 코드' },
    { value: 'productName', label: '제품명' },
    { value: 'company', label: '업체명' },
  ];

  const weeks = ['1주차', '2주차', '3주차', '4주차', '5주차'];

  const fetchFilterList = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8090/tree/api/filterList`, {
        params: { filterColumn },
        withCredentials: true,
      });
      const data = Array.isArray(response.data.filterList) ? response.data.filterList : [];
      setProductList(data);
      setShowProductList(true);
    } catch (error) {
      console.error('Error fetching filter list:', error);
      setProductList([]);
    }
  }, [filterColumn]);

  const fetchReport = useCallback(
    async (newYearMonth, newFilterType, newFilterValue) => {
      const dateToFetch = newYearMonth || today;

      try {
        const [year, month] = dateToFetch.split('-');
        const response = await axios.get(`http://localhost:8090/tree/api/report`, {
          params: {
            year,
            month,
            filterType: newFilterType,
            filterValue: newFilterValue || '',
          },
          withCredentials: true,
        });

        if (response.data) {
          const {
            weeklyStockCount,
            weeklyReleaseCount,
            avgWeeklyStockCount,
            minWeeklyStockCount,
            maxWeeklyStockCount,
          } = response.data;

          const isEmptyReport =
            !Object.values(weeklyStockCount || {}).some((val) => val) &&
            !Object.values(weeklyReleaseCount || {}).some((val) => val) &&
            !Object.values(avgWeeklyStockCount || {}).some((val) => val) &&
            !Object.values(minWeeklyStockCount || {}).some((val) => val) &&
            !Object.values(maxWeeklyStockCount || {}).some((val) => val);

          if (isEmptyReport) {
            setReport({
              weeklyStockCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              weeklyReleaseCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              avgWeeklyStockCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              minWeeklyStockCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              maxWeeklyStockCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            });
          } else {
            setReport(response.data);
            setSelectedYearMonth(dateToFetch);
            setSelectedProduct(newFilterValue);
            if (newFilterType === 'productCode' || newFilterType === 'productName') {
              const productResponse = await axios.get(`http://localhost:8090/tree/api/productDetail`, {
                params: {
                  filterType: newFilterType,
                  filterValue: newFilterValue,
                },
                withCredentials: true,
              });
              setProductCount(productResponse.data.prodCnt || 0);
            } else {
              setProductCount(0);
            }
          }
        } else {
          setReport(null);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setReport(null);
      }
    },
    [today],
  );

  const fetchYearlyReport = useCallback(async (year, filterType, filterValue) => {
    try {
      const response = await axios.get(`http://localhost:8090/tree/api/report`, {
        params: {
          year,
          filterType,
          filterValue,
        },
        withCredentials: true,
      });

      const monthlyData = response.data.monthlyData || {};
      setMonthlyReport(monthlyData);
    } catch (error) {
      console.error('Error fetching yearly report:', error);
    }
  }, []);

  const fetchReportAndYearlyReport = useCallback(
    async (newYearMonth) => {
      const dateToFetch = newYearMonth || yearMonth;
      const [year, month] = dateToFetch.split('-');

      try {
        await fetchReport(dateToFetch, filterColumn, productName);
        await fetchYearlyReport(year, filterColumn, productName);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 404) {
          console.log('요청한 데이터를 찾을 수 없습니다.');
        } else if (error.response && error.response.data.error) {
          console.log(`데이터를 가져오는 중 오류가 발생했습니다: ${error.response.data.error}`);
        } else {
          console.log('데이터를 가져오는 중 오류가 발생했습니다.');
        }
      }
    },
    [yearMonth, filterColumn, productName, fetchReport, fetchYearlyReport],
  );

  // 차트 데이터 메모이제이션
  const memoizedMonthlyReport = useMemo(() => monthlyReport, [monthlyReport]);

  const { memoizedTotalStockCount, memoizedTotalReleaseCount } = useMemo(() => {
    const totalStockCount = report ? Object.values(report.weeklyStockCount || {}).reduce((a, b) => a + b, 0) : 0;
    const totalReleaseCount = report ? Object.values(report.weeklyReleaseCount || {}).reduce((a, b) => a + b, 0) : 0;
    return { memoizedTotalStockCount: totalStockCount, memoizedTotalReleaseCount: totalReleaseCount };
  }, [report]);
  const handleInputClick = () => {
    fetchFilterList();
  };

  const handleFilterColumnChange = (event) => {
    const selectedColumn = event.target.value;
    setFilterColumn(selectedColumn);
    setShowProductList(false);
    setProductName('');
    fetchFilterList();
  };

  const handleProductNameKeyPress = async (event) => {
    if (event.key === 'Enter') {
      await fetchReportAndYearlyReport();
    }
  };

  const handleYearMonthChange = async (event) => {
    const selectedYearMonth = event.target.value;
    setYearMonth(selectedYearMonth);
    await fetchReportAndYearlyReport(selectedYearMonth);
  };

  const handleProductSelect = async (product) => {
    setProductName(product);
    setShowProductList(false);
    await fetchReportAndYearlyReport();
  };

  const getValue = (value) => value ?? 0;

  const calculateAverage = (sum, count) => {
    return count === 0 ? 0 : (sum / count).toFixed(2);
  };

  const totalStockCount = report ? Object.values(report.weeklyStockCount || {}).reduce((a, b) => a + b, 0) : 0;
  const totalReleaseCount = report ? Object.values(report.weeklyReleaseCount || {}).reduce((a, b) => a + b, 0) : 0;

  useEffect(() => {
    fetchReportAndYearlyReport(today);
  }, [fetchReport, fetchYearlyReport, filterColumn, productName, today]);

  return (
    <div>
      <div className={style.statisticsSearchFilterContainer}>
        <div className={style.statisticsSearchInputContainer}>
          <img src={searchIcon} alt="조회 아이콘" className={style.statisticsIcon} />
          <input
            type="month"
            className={style.statisticsSearchInput}
            value={yearMonth}
            onChange={handleYearMonthChange}
            placeholder="연도 선택"
            style={{ width: '508px' }}
          />
        </div>
      </div>
      <div className={style.statisticsSearchFilterContainer}>
        <div className={style.statisticsSearchInputContainer}>
          <FormControl variant="outlined" size="small" className={`${style.filterColumnSelect}`}>
            <Select id="filter-column" value={filterColumn} onChange={handleFilterColumnChange} displayEmpty>
              {filterColumns.map((column) => (
                <MenuItem key={column.value} value={column.value}>
                  {column.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            className={style.statisticsSearchInput}
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyPress={handleProductNameKeyPress}
            placeholder="검색어 입력"
            onClick={handleInputClick}
            disabled={!yearMonth}
          />
          {showProductList && Array.isArray(productList) && productList.length > 0 && (
            <ul className={style.productList}>
              {productList.map((product, index) => (
                <li key={index} onClick={() => handleProductSelect(product)}>
                  {product}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <table className={style.statisticsTable}>
          <thead>
            <tr>
              <th className={style.statisticsTableThead1}>년도</th>
              <td className={style.statisticsTableTbody1}>{selectedYearMonth}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={style.statisticsTableThead1}>상품명</td>
              <td className={style.statisticsTableTbody1}>{selectedProduct || '모든 상품'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table className={style.statisticsTable}>
          <thead>
            <tr>
              <th className={style.statisticsTableHead2}>주차별</th>
              <th className={style.statisticsTableHead2}>입고수량</th>
              <th className={style.statisticsTableHead2}>출고수량</th>
              <th className={style.statisticsTableHead2}>최저입고</th>
              <th className={style.statisticsTableHead2}>최고입고</th>
              <th className={style.statisticsTableHead2}>평균입고</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}>
                <td className={style.statisticsTableTBody2}>{week}</td>
                <td className={style.statisticsTableTBody2}>{getValue(report?.weeklyStockCount?.[index + 1])}</td>
                <td className={style.statisticsTableTBody2}>{getValue(report?.weeklyReleaseCount?.[index + 1])}</td>
                <td className={style.statisticsTableTBody2}>{getValue(report?.minWeeklyStockCount?.[index + 1])}</td>
                <td className={style.statisticsTableTBody2}>{getValue(report?.maxWeeklyStockCount?.[index + 1])}</td>
                <td className={style.statisticsTableTBody2}>{getValue(report?.avgWeeklyStockCount?.[index + 1])}</td>
              </tr>
            ))}
            <tr>
              <td className={style.statisticsTabletotal}>총 합</td>
              <td className={style.statisticsTabletotal}>{totalStockCount}</td>
              <td className={style.statisticsTabletotal}>{totalReleaseCount}</td>
              <td className={style.statisticsTabletotal}>
                {getValue(Math.min(...Object.values(report?.minWeeklyStockCount || [0])))}
              </td>
              <td className={style.statisticsTabletotal}>
                {getValue(Math.max(...Object.values(report?.maxWeeklyStockCount || [0])))}
              </td>
              <td className={style.statisticsTabletotal}>
                {calculateAverage(
                  getValue(Object.values(report?.avgWeeklyStockCount || {}).reduce((a, b) => a + b, 0)),
                  getValue(Object.keys(report?.avgWeeklyStockCount || {}).length),
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={style.chartContainer}>
        <PieChart
          className={style.pieChartContainer}
          totalStockCount={memoizedTotalStockCount}
          totalReleaseCount={memoizedTotalReleaseCount}
          productCount={productCount}
        />
        <Suspense fallback={<div>Loading chart...</div>}>
          <MixChart data={memoizedMonthlyReport} />
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Statistics);
