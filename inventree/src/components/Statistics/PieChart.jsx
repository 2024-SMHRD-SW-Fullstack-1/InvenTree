import React from 'react';
import { ResponsivePie } from '@nivo/pie';

/**
 * PieChart 컴포넌트
 *
 * @param {Object} props - 컴포넌트에 전달된 속성
 * @param {string} props.className - 컴포넌트의 클래스 이름
 * @param {number} props.totalStockCount - 총 입고 수량
 * @param {number} props.totalReleaseCount - 총 출고 수량
 * @param {number} props.productCount - 제품 수량
 * @param {boolean} props.showText - 텍스트 표시 여부
 * @returns {JSX.Element} 파이 차트를 렌더링하는 JSX 엘리먼트
 */
const PieChart = ({ className, totalStockCount = 0, totalReleaseCount = 0, productCount = 0, showText = true }) => {
  // 중앙 텍스트 레이어 정의
  const centerTextLayer = {
    render: (props) => {
      const centerX = props.centerX;
      const centerY = props.centerY;

      return showText ? (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: '20px',
            fontFamily: 'Inter',
            fill: '#ffffff',
          }}
        >
          재고 수량
        </text>
      ) : (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: '16px',
            fontFamily: 'Inter',
            fill: '#ffffff',
          }}
        >
          <tspan x={centerX} dy="-2.5em">{`이달 입고량`}</tspan>
          <tspan x={centerX} dy="1.5em">{`${totalStockCount}`}</tspan>
          <tspan x={centerX} dy="2.5em">{`이달 출고량`}</tspan>{' '}
          <tspan x={centerX} dy="1.5em">{`${totalReleaseCount}`}</tspan>
        </text>
      );
    },
  };

  // 값 레이어 정의
  const valueLayer = {
    render: (props) => {
      const centerX = props.centerX;
      const centerY = props.centerY + 35;

      return showText ? (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: '20px',
            fill: '#ffffff',
          }}
        >
          {productCount}
        </text>
      ) : null;
    },
  };

  // 왼쪽 상단 텍스트 레이어 정의
  const leftTopTextLayer = {
    render: (props) => {
      const centerX = props.centerX - 195;
      const centerY = props.centerY - 155;

      return (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: '20px',
            fontFamily: 'Inter',
            fill: '#ffffff',
          }}
        ></text>
      );
    },
  };

  // 파이 차트 렌더링
  return (
    <div className={className}>
      <ResponsivePie
        data={[
          { id: '입고수량', value: totalStockCount },
          { id: '출고수량', value: totalReleaseCount },
        ]}
        margin={{ top: 40, right: 168, bottom: 57, left: 173 }}
        innerRadius={0.7}
        padAngle={0}
        cornerRadius={0}
        colors={['#C6EE71', '#7DD8F4']}
        borderWidth={0}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 20,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 38,
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
          },
        ]}
        theme={{
          text: {
            fill: '#ffffffea',
            fontFamily: 'Inter',
          },
        }}
        layers={['arcs', 'legends', centerTextLayer.render, valueLayer.render, leftTopTextLayer.render]}
      />
    </div>
  );
};

export default PieChart;
