import React, { useState, useEffect, useCallback } from "react";
import style from "./Statistics.module.css";
import searchIcon from "../../assets/images/검색L.png";
import axios from "axios";
import { FormControl, Select, MenuItem } from "@mui/material";
import MixChart from "./MixChart";
import PieChart from "./PieChart";

const Statistics = () => {
    const today = new Date().toISOString().slice(0, 7); // YYYY-MM 형식의 오늘 날짜
    const [yearMonth, setYearMonth] = useState(today);
    const [productName, setProductName] = useState("");
    const [report, setReport] = useState(null);
    const [selectedYearMonth, setSelectedYearMonth] = useState(today);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [productList, setProductList] = useState([]);
    const [showProductList, setShowProductList] = useState(false);
    const [filterColumn, setFilterColumn] = useState("type");
    const [productCount, setProductCount] = useState(0);
    const [monthlyReport, setMonthlyReport] = useState({});

    const filterColumns = [
        { value: "type", label: "구분" },
        { value: "productCode", label: "제품 코드" },
        { value: "productName", label: "제품명" },
        { value: "company", label: "업체명" },
    ];

    const weeks = ["1주차", "2주차", "3주차", "4주차", "5주차"];

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
            console.error("Error fetching filter list:", error);
            setProductList([]);
        }
    }, [filterColumn]);

    const fetchReport = useCallback(
        async (newYearMonth, newFilterType, newFilterValue) => {
            const dateToFetch = newYearMonth || today; // newYearMonth가 없으면 오늘 날짜 사용

            try {
                const [year, month] = dateToFetch.split("-");
                const response = await axios.get(`http://localhost:8090/tree/api/report`, {
                    params: {
                        year,
                        month,
                        filterType: newFilterType,
                        filterValue: newFilterValue || "",
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
                        if (newFilterType === "productCode" || newFilterType === "productName") {
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
                console.error("Error fetching report:", error);
                if (error.response) {
                    if (error.response.status === 404) {
                        alert("요청한 데이터를 찾을 수 없습니다.");
                    } else if (error.response.status === 403) {
                        alert("접근 권한이 없습니다. 다시 로그인해 주세요.");
                    } else {
                        alert(`데이터를 가져오는 중 오류가 발생했습니다: ${error.response.data.error}`);
                    }
                } else {
                    alert("서버와의 연결에 실패했습니다.");
                }
                setReport(null);
            }
        },
        [today]
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
            console.error("Error fetching yearly report:", error);
        }
    }, []);

    const handleInputClick = () => {
        fetchFilterList();
    };

    const handleFilterColumnChange = (event) => {
        const selectedColumn = event.target.value;
        setFilterColumn(selectedColumn);
        setShowProductList(false);
        setProductName("");
    };

    const handleProductNameKeyPress = (event) => {
        if (event.key === "Enter") {
            fetchReport(yearMonth, filterColumn, productName);
        }
    };

    const handleYearMonthChange = async (event) => {
        const selectedYearMonth = event.target.value;
        setYearMonth(selectedYearMonth);
        const [year] = selectedYearMonth.split("-");
        await fetchReport(selectedYearMonth, filterColumn, productName);
        await fetchYearlyReport(year, filterColumn, productName);
    };

    const handleProductSelect = async (product) => {
        setProductName(product);
        setShowProductList(false);
        await fetchReport(yearMonth, filterColumn, product);
        const [year] = yearMonth.split("-");
        await fetchYearlyReport(year, filterColumn, product);
    };

    const getValue = (value) => value ?? 0;

    const calculateAverage = (sum, count) => {
        return count === 0 ? 0 : (sum / count).toFixed(2);
    };

    const totalStockCount = report ? Object.values(report.weeklyStockCount || {}).reduce((a, b) => a + b, 0) : 0;
    const totalReleaseCount = report ? Object.values(report.weeklyReleaseCount || {}).reduce((a, b) => a + b, 0) : 0;

    useEffect(() => {
        fetchReport(today, filterColumn, productName); // 컴포넌트가 마운트될 때 오늘 날짜로 보고서 데이터를 가져옵니다.
        const [year] = today.split("-");
        fetchYearlyReport(year, filterColumn, productName);
    }, [fetchReport, fetchYearlyReport, filterColumn, productName, today]); // 필요한 의존성들을 추가했습니다.

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
                        style={{ width: "508px" }}
                    />
                </div>
            </div>
            <div className={style.statisticsSearchFilterContainer}>
                <div className={style.statisticsSearchInputContainer}>
                    <FormControl variant="outlined" size="small" className={`${style.filterColumnSelect}`}>
                        <Select
                            id="filter-column"
                            value={filterColumn}
                            onChange={handleFilterColumnChange}
                            displayEmpty
                        >
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
                        placeholder="검색어 입력"
                        onClick={handleInputClick}
                        onKeyPress={handleProductNameKeyPress}
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
                            <td className={style.statisticsTableTbody1}>{selectedProduct || "모든 상품"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <table className={style.statisticsTable}>
                    <thead>
                        <tr>
                            <th className={style.statisticsTableHead2}>일별</th>
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
                                <td className={style.statisticsTableTBody2}>
                                    {getValue(report?.weeklyStockCount?.[index + 1])}
                                </td>
                                <td className={style.statisticsTableTBody2}>
                                    {getValue(report?.weeklyReleaseCount?.[index + 1])}
                                </td>
                                <td className={style.statisticsTableTBody2}>
                                    {getValue(report?.minWeeklyStockCount?.[index + 1])}
                                </td>
                                <td className={style.statisticsTableTBody2}>
                                    {getValue(report?.maxWeeklyStockCount?.[index + 1])}
                                </td>
                                <td className={style.statisticsTableTBody2}>
                                    {getValue(report?.avgWeeklyStockCount?.[index + 1])}
                                </td>
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
                                    getValue(
                                        Object.values(report?.avgWeeklyStockCount || {}).reduce((a, b) => a + b, 0)
                                    ),
                                    getValue(Object.keys(report?.avgWeeklyStockCount || {}).length)
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={style.chartContainer}>
                <PieChart
                    className={style.pieChartContainer}
                    totalStockCount={totalStockCount}
                    totalReleaseCount={totalReleaseCount}
                    productCount={productCount}
                />
                <MixChart data={monthlyReport} />
            </div>
        </div>
    );
};

export default Statistics;
