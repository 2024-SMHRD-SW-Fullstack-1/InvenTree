import React, { useState, useEffect, useCallback } from "react";
import style from "./Main.module.css";
import WarehouseLayout from "../WarehouseLayout/WarehouseLayout";
import InoutHistoryTable from "./InoutHistoryTable";
import PieChart from "../Statistics/PieChart";
import MixChart from "../Statistics/MixChart";
import axios from "axios";

const Main = () => {
    const today = new Date().toISOString().slice(0, 7); // YYYY-MM 형식의 오늘 날짜
    const [entries, setEntries] = useState([]);
    const [report, setReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState({});
    const [productCount, setProductCount] = useState(0);
    const corpIdx = localStorage.getItem("corpIdx");

    const fetchEntries = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8090/tree/api/stockEntries", {
                params: { corpIdx },
                withCredentials: true,
            });
            const { entries } = response.data;
            const mappedEntries = (entries || []).map((data) => ({
                ...data,
                type: data.isRelease === "Y" ? "출고" : "입고",
                quantity: data.isRelease === "Y" ? data.releaseCnt : data.stockCnt,
                date: data.date,
            }));
            setEntries(mappedEntries);
            console.log("Fetched entries:", mappedEntries);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    }, [corpIdx]);

    const fetchReport = useCallback(
        async (yearMonth) => {
            const dateToFetch = yearMonth || today; // yearMonth가 없으면 오늘 날짜 사용
            const [year, month] = dateToFetch.split("-");
            console.log(`Fetching report with params: year=${year}, month=${month}, corpIdx=${corpIdx}`);
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/report`, {
                    params: { year, month, corpIdx, filterType: "", filterValue: "" },
                    withCredentials: true,
                });
                console.log("Report data received from server:", response.data);
                if (response.data) {
                    setReport(response.data);
                    setMonthlyReport(response.data.monthlyReport || {});
                } else {
                    console.error("Report data is null or undefined");
                }
            } catch (error) {
                console.error("Error fetching report:", error);
                if (error.response && error.response.status === 403) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    window.location.href = "/login";
                }
            }
        },
        [corpIdx, today]
    );

    const fetchYearlyReport = useCallback(
        async (year) => {
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/report`, {
                    params: { year, corpIdx, filterType: "", filterValue: "" },
                    withCredentials: true,
                });
                const monthlyData = response.data.monthlyData || {};
                setMonthlyReport(monthlyData);
            } catch (error) {
                console.error("Error fetching yearly report:", error);
            }
        },
        [corpIdx]
    );

    const totalStockCount = report ? Object.values(report.weeklyStockCount || {}).reduce((a, b) => a + b, 0) : 0;
    const totalReleaseCount = report ? Object.values(report.weeklyReleaseCount || {}).reduce((a, b) => a + b, 0) : 0;

    useEffect(() => {
        fetchEntries();
        fetchReport(today); // 컴포넌트가 마운트될 때 오늘 날짜로 보고서 데이터를 가져옵니다.
        const [year] = today.split("-");
        fetchYearlyReport(year);
    }, [fetchEntries, fetchReport, fetchYearlyReport, today]);

    return (
        <div className={style.mainContainer}>
            <div className={style.content}>
                <div className={style.warehouseSection}>
                    <h2>창고 배치도</h2>
                    <WarehouseLayout />
                </div>
                <div className={style.inoutSection}>
                    <h2>입출고 내역</h2>
                    <InoutHistoryTable entries={entries} />
                </div>
                <div className={style.statisticsSection}>
                    <h2>통계 데이터</h2>
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
            </div>
        </div>
    );
};

export default Main;
