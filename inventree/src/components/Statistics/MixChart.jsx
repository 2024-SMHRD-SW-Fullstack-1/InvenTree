import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineController,
    BarController,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineController,
    BarController
);

const MixChart = ({ data }) => {
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const stockData = months.map((_, i) => {
        const weeklyStockCount = data?.[i + 1]?.weeklyStockCount || {};
        const totalStockCount = Object.values(weeklyStockCount).reduce((a, b) => a + b, 0);
        return totalStockCount;
    });
    const avgStockData = months.map((_, i) => {
        const avgWeeklyStockCount = data?.[i + 1]?.avgWeeklyStockCount || {};
        const avgStockCount = Object.keys(avgWeeklyStockCount).length
            ? Object.values(avgWeeklyStockCount).reduce((a, b) => a + b, 0) / Object.keys(avgWeeklyStockCount).length
            : 0;
        return avgStockCount;
    });
    const chartData = {
        labels: months,
        datasets: [
            {
                type: "bar",
                label: "출고량",
                data: stockData,
                backgroundColor: "#8FCDDA",
                borderColor: "#8FCDDA",
                borderWidth: 1,
                order: 2,
            },
            {
                type: "line",
                label: "평균입고량",
                data: avgStockData,
                backgroundColor: "#FFB3B3",
                borderColor: "#FFB3B3",
                fill: false,
                tension: 0,
                pointBackgroundColor: "#C08787",
                pointBorderColor: "#C08787",
                pointHoverBackgroundColor: "#DC9A9A",
                pointHoverBorderColor: "#DC9A9A",
                pointRadius: 4,
                order: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    color: "#B4B6C4",
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: false,
                },
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#B4B6C4",
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                display: true,
                title: {
                    display: false,
                },
                grid: {
                    display: false,
                },
                ticks: {
                    beginAtZero: true,
                    color: "#B4B6C4",
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: "739px", height: "439px" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default MixChart;
