import React from 'react';
import { Bar } from 'react-chartjs-2';
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
} from 'chart.js';

// ChartJS 모듈을 등록합니다.
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
  BarController,
);

/**
 * MixChart 컴포넌트
 *
 * @param {Object} props - 컴포넌트에 전달된 속성
 * @param {Object} props.data - 월별 입출고 데이터를 포함하는 객체
 * @returns {JSX.Element} 혼합 차트를 렌더링하는 JSX 엘리먼트
 */
const MixChart = ({ data }) => {
  // 월 이름 배열을 정의합니다.
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // 월별 입고량 데이터를 계산합니다.
  const monthlyStockData = months.map((_, i) => {
    const weeklyStockCount = data?.[i + 1]?.weeklyStockCount || {};
    const totalMonthlyStockCount = Object.values(weeklyStockCount).reduce((a, b) => a + b, 0);
    return totalMonthlyStockCount;
  });

  // 월별 출고량 데이터를 계산합니다.
  const monthlyReleaseData = months.map((_, i) => {
    const weeklyReleaseCount = data?.[i + 1]?.weeklyReleaseCount || {};
    const totalMonthlyReleaseCount = Object.values(weeklyReleaseCount).reduce((a, b) => a + b, 0);
    return totalMonthlyReleaseCount;
  });

  // 차트에 사용할 데이터를 정의합니다.
  const chartData = {
    labels: months,
    datasets: [
      {
        type: 'bar',
        label: '출고량',
        data: monthlyReleaseData,
        backgroundColor: '#8FCDDA',
        borderColor: '#8FCDDA',
        borderWidth: 1,
        order: 2,
      },
      {
        type: 'line',
        label: '입고량',
        data: monthlyStockData,
        backgroundColor: '#ff7300',
        borderColor: '#ff7300',
        fill: false,
        tension: 0,
        pointBackgroundColor: '#ff7300',
        pointBorderColor: '#ff7300',
        pointHoverBackgroundColor: '#ff7300',
        pointHoverBorderColor: '#ff7300',
        pointRadius: 4,
        order: 1,
      },
    ],
  };

  // 차트 옵션을 정의합니다.
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#B4B6C4',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
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
          color: '#B4B6C4',
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
          color: '#B4B6C4',
          font: {
            size: 10,
          },
        },
      },
    },
  };

  // 차트를 렌더링합니다.
  return (
    <div style={{ width: '700px', height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MixChart;
