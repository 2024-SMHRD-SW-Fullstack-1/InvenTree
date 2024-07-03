import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const StatisticsContext = createContext();

export const useStatistics = () => useContext(StatisticsContext);

export const StatisticsProvider = ({ children }) => {
    const [entries, setEntries] = useState([]);
    const [report, setReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState({});
    const [totalStockCount, setTotalStockCount] = useState(0);
    const [totalReleaseCount, setTotalReleaseCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const corpIdx = localStorage.getItem("corpIdx");

    useEffect(() => {
        const fetchEntries = async () => {
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
        };

        const fetchReport = async () => {
            try {
                const today = new Date().toISOString().slice(0, 7);
                const [year, month] = today.split("-");
                console.log(`Fetching report with params: year=${year}, month=${month}, corpIdx=${corpIdx}`);
                const response = await axios.get(`http://localhost:8090/tree/api/report`, {
                    params: { year, month, corpIdx, filterType: "", filterValue: "" },
                    withCredentials: true,
                });
                console.log("Report data received from server:", response.data); // Add this log
                if (response.data) {
                    setReport(response.data);
                    setTotalStockCount(response.data.totalStockCount || 0);
                    setTotalReleaseCount(response.data.totalReleaseCount || 0);
                    setProductCount(response.data.productCount || 0);
                    setMonthlyReport(response.data.monthlyReport || {});
                    console.log("State after fetchReport - report:", response.data);
                    console.log("State after fetchReport - totalStockCount:", response.data.totalStockCount);
                    console.log("State after fetchReport - totalReleaseCount:", response.data.totalReleaseCount);
                    console.log("State after fetchReport - productCount:", response.data.productCount);
                    console.log("State after fetchReport - monthlyReport:", response.data.monthlyReport);
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
        };

        fetchEntries();
        fetchReport();
    }, [corpIdx]);

    useEffect(() => {
        console.log("StatisticsContext - entries:", entries);
        console.log("StatisticsContext - report:", report);
        console.log("StatisticsContext - monthlyReport:", monthlyReport);
        console.log("StatisticsContext - totalStockCount:", totalStockCount);
        console.log("StatisticsContext - totalReleaseCount:", totalReleaseCount);
        console.log("StatisticsContext - productCount:", productCount);
    }, [entries, report, monthlyReport, totalStockCount, totalReleaseCount, productCount]);

    return (
        <StatisticsContext.Provider
            value={{ entries, report, monthlyReport, totalStockCount, totalReleaseCount, productCount }}
        >
            {children}
        </StatisticsContext.Provider>
    );
};
