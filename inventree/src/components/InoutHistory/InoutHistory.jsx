import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { TextField, FormControl, Select, MenuItem, Pagination, Button } from '@mui/material';
import { styled } from '@mui/system';
import * as XLSX from 'xlsx';
import style from './InoutHistory.module.css';

// 커스텀 버튼 - 내보내기 버튼의 스타일을 정의합니다.
const CustomButton = styled(Button)({
  backgroundColor: '#6fa16f',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d8e5d',
  },
});

// 커스텀 페이징 - 현재 페이지의 스타일을 정의합니다.
const CustomPagination = styled(Pagination)({
  '& .Mui-selected': {
    backgroundColor: '#6fa16f !important',
    color: 'white !important',
  },
});

const InoutHistory = () => {
  const [entries, setEntries] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterColumn, setFilterColumn] = useState('productName');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const entriesPerPage = 10;
  const corpIdx = localStorage.getItem('corpIdx'); // 현재 로그인한 corpIdx 가져오기

  // 필터 옵션들
  const filterColumns = [
    { value: 'date', label: '날짜' },
    { value: 'type', label: '구분' },
    { value: 'productCode', label: '제품 코드' },
    { value: 'productName', label: '제품명' },
    { value: 'quantity', label: '수량' },
    { value: 'company', label: '업체명' },
  ];

  // 서버로부터 데이터를 가져오는 함수
  const fetchEntries = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8090/tree/api/stockEntries', {
        params: {
          page,
          size: entriesPerPage,
          filterColumn,
          filterValue: filter,
          corpIdx,
        },
      });
      const { entries, totalPages } = response.data;
      const mappedEntries = (entries || []).map((data) => ({
        ...data,
        type: data.isRelease === 'Y' ? '출고' : '입고',
        quantity: data.isRelease === 'Y' ? data.releaseCnt : data.stockCnt,
        date: data.date,
        checked: false,
      }));
      setEntries(mappedEntries);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }, [page, filter, filterColumn, entriesPerPage, corpIdx]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // 개별 체크박스 변경 핸들러
  const handleCheckboxChange = (index) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry, i) => (i === index ? { ...entry, checked: !entry.checked } : entry)),
    );
  };

  // 행 클릭 핸들러
  const handleRowClick = (index) => {
    handleCheckboxChange(index);
  };

  // 전체 선택 체크박스 변경 핸들러
  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      setEntries((prevEntries) => prevEntries.map((entry) => ({ ...entry, checked: newSelectAll })));
      return newSelectAll;
    });
  };

  // 데이터 내보내기 핸들러
  const handleExport = () => {
    const exportData = entries
      .filter((entry) => entry.checked)
      .map(({ date, type, productCode, productName, quantity, company }) => ({
        date,
        type,
        productCode,
        productName,
        quantity,
        company,
      }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Entries');
    XLSX.writeFile(workbook, 'stock_entries.xlsx');
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // 필터 값 변경 핸들러
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  // 필터 컬럼 변경 핸들러
  const handleFilterColumnChange = (e) => {
    setFilterColumn(e.target.value);
    setPage(1);
  };

  return (
    <div className={style.tableContainer}>
      <div className={style.headerContainer}>
        <h2 className={style.title}>입출고 내역</h2>
        <div className={style.filterContainer}>
          <FormControl variant="outlined" size="small" className={style.filterColumnSelect}>
            <Select id="filter-column" value={filterColumn} onChange={handleFilterColumnChange} displayEmpty>
              {filterColumns.map((column) => (
                <MenuItem key={column.value} value={column.value}>
                  {column.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {filterColumn === 'date' ? (
            <TextField
              variant="outlined"
              size="small"
              type="date"
              value={filter}
              onChange={handleFilterChange}
              className={style.searchInput}
              placeholder="날짜 선택"
            />
          ) : (
            <TextField
              variant="outlined"
              size="small"
              value={filter}
              onChange={handleFilterChange}
              className={style.searchInput}
              placeholder="검색어 입력"
            />
          )}
        </div>
        <CustomButton onClick={handleExport} className={style.filterButton}>
          내보내기
        </CustomButton>
      </div>
      <table className={style.table}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" className={style.checkbox} checked={selectAll} onChange={handleSelectAllChange} />
            </th>
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
            <tr key={index} onClick={() => handleRowClick(index)}>
              <td>
                <input
                  type="checkbox"
                  className={style.checkbox}
                  checked={entry.checked}
                  onChange={(e) => e.stopPropagation()}
                />
              </td>
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
      <CustomPagination count={totalPages} page={page} onChange={handleChangePage} className={style.pagination} />
    </div>
  );
};

export default InoutHistory;
