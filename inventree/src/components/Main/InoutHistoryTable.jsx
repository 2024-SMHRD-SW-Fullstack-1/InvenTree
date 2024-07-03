import React from 'react';
import style from './Main.module.css';

/**
 * InoutHistoryTable 컴포넌트
 * 입출고 내역을 테이블 형식으로 표시합니다.
 *
 * @param {Object} props - 컴포넌트의 props
 * @param {Array} props.entries - 입출고 내역 배열
 * @returns {JSX.Element} 테이블 형태의 입출고 내역 컴포넌트
 */
const InoutHistoryTable = ({ entries }) => {
  return (
    <table className={style.table}>
      <thead>
        <tr className={style.tableTh}>
          <th>날짜</th>
          <th>구분</th>
          <th>제품 코드</th>
          <th>제품명</th>
          <th>수량</th>
          <th>업체명</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={index}>
            <td>{entry.date}</td>
            <td className={entry.type === '입고' ? style.incoming : style.outgoing}>{entry.type}</td>
            <td>{entry.productCode}</td>
            <td>{entry.productName}</td>
            <td>{entry.quantity}</td>
            <td>{entry.company}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InoutHistoryTable;
