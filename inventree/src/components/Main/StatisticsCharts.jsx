import React from "react";
import style from "./Main.module.css";
import PieChart from "../Statistics/PieChart";
import MixChart from "../Statistics/MixChart";
import { useStatistics } from "./StatisticsContext";

const StatisticsCharts = () => {
    const { report, monthlyReport, totalStockCount, totalReleaseCount, productCount } = useStatistics();

    console.log("StatisticsCharts - report:", report);
    console.log("StatisticsCharts - monthlyReport:", monthlyReport);
    console.log("StatisticsCharts - totalStockCount:", totalStockCount);
    console.log("StatisticsCharts - totalReleaseCount:", totalReleaseCount);
    console.log("StatisticsCharts - productCount:", productCount);

    if (!report) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className={style.chartContainer}>
                <PieChart
                    className={style.pieChartContainer}
                    totalStockCount={totalStockCount}
                    totalReleaseCount={totalReleaseCount}
                    productCount={productCount}
                />
                <MixChart className={style.barChartContainer} data={monthlyReport} />
            </div>
        </div>
    );
};

export default StatisticsCharts;
