import React from 'react';
import style from './Main.module.css';
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
            <td>{entry.type}</td>
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
