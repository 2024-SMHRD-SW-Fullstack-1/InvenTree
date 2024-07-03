/**
 * @fileoverview 입출고 내역을 표시하고 관리하는 컴포넌트
 * 입출고 데이터를 테이블 형식으로 표시하고, 필터링, 페이징, 데이터 내보내기 기능을 제공합니다.
 */

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { TextField, FormControl, Select, MenuItem, Pagination, Button } from '@mui/material';
import { styled } from '@mui/system';
import * as XLSX from 'xlsx';
import { useDarkMode } from '../DarkMode/DarkModeContext'; // useDarkMode 훅을 가져옵니다.
import style from './InoutHistory.module.css';

// 커스텀 버튼 - 내보내기 버튼의 스타일을 정의합니다.
const CustomButton = styled(Button)({
  backgroundColor: '#6fa16f',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d8e5d',
  },
});

// 버튼 컨테이너 - 버튼들을 포함하는 컨테이너를 정의합니다.
const ButtonContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px', // 버튼 간의 간격을 설정합니다.
});

// 커스텀 페이징 - 현재 페이지의 스타일을 정의합니다.
const CustomPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  },
  '& .Mui-selected': {
    backgroundColor: '#6fa16f !important',
    color: 'white !important',
  },
}));

// 다크 모드용 커스텀 텍스트 필드
const DarkModeTextField = styled(TextField)(({ theme, darkMode }) => ({
  '& .MuiInputBase-root': {
    color: darkMode ? 'white' : 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
    '&:hover fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
    '&.Mui-focused fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
  },
  '& .MuiInputLabel-root': {
    color: darkMode ? 'white' : 'black',
  },
}));

// 다크 모드용 커스텀 셀렉트 필드
const DarkModeSelect = styled(Select)(({ theme, darkMode }) => ({
  '& .MuiInputBase-root': {
    color: darkMode ? 'white' : 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
    '&:hover fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
    '&.Mui-focused fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
  },
  '& .MuiInputLabel-root': {
    color: darkMode ? 'white' : 'black',
  },
  '& .MuiSelect-icon': {
    color: darkMode ? 'white' : 'black',
  },
}));

// 다크 모드용 커스텀 폼 컨트롤
const DarkModeFormControl = styled(FormControl)(({ theme, darkMode }) => ({
  '& .MuiInputBase-root': {
    color: darkMode ? 'white' : 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
    '&:hover fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
    '&.Mui-focused fieldset': {
      borderColor: darkMode ? 'white' : '#6fa16f',
    },
  },
  '& .MuiInputLabel-root': {
    color: darkMode ? 'white' : 'black',
  },
}));

// 메뉴 속성 정의
const menuProps = {
  PaperProps: {
    sx: {
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#333' : '#fff'),
      color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black'),
    },
  },
};

/**
 * 입출고 내역 컴포넌트
 * @returns {React.Component} 입출고 내역 테이블 및 관련 기능을 포함한 컴포넌트
 */
const InoutHistory = () => {
  // 상태 변수들
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterColumn, setFilterColumn] = useState('productName');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const entriesPerPage = 10;
  const corpIdx = localStorage.getItem('corpIdx'); // 현재 로그인한 corpIdx 가져오기

  const { darkMode } = useDarkMode(); // 다크 모드 상태를 가져옵니다.

  // 필터 옵션들
  const filterColumns = [
    { value: 'date', label: '날짜' },
    { value: 'type', label: '구분' },
    { value: 'productCode', label: '제품 코드' },
    { value: 'productName', label: '제품명' },
    { value: 'quantity', label: '수량' },
    { value: 'company', label: '업체명' },
  ];

  /**
   * 서버로부터 데이터를 가져오는 함수
   */
  const fetchEntries = useCallback(async () => {
    console.log(
      `Fetching entries with page: ${page}, size: ${entriesPerPage}, filterColumn: ${filterColumn}, filterValue: ${filter}`,
    );
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
      console.log('Server response:', response.data);
      const { entries, totalEntries, totalPages } = response.data; // totalEntries 추가
      const mappedEntries = (entries || []).map((data) => ({
        ...data,
        type: data.isRelease === 'Y' ? '출고' : '입고',
        quantity: data.isRelease === 'Y' ? data.releaseCnt : data.stockCnt,
        date: data.date,
      }));
      setEntries(mappedEntries);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }, [page, filter, filterColumn, entriesPerPage, corpIdx]);

  const fetchAllEntries = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8090/tree/api/stockEntries', {
        params: {
          page: 1,
          size: totalPages * entriesPerPage, // 전체 페이지 데이터 가져오기
          filterColumn,
          filterValue: filter,
          corpIdx,
        },
      });
      const { entries } = response.data;
      const mappedEntries = (entries || []).map((data) => ({
        ...data,
        type: data.isRelease === 'Y' ? '출고' : '입고',
        quantity: data.isRelease === 'Y' ? data.releaseCnt : data.stockCnt,
        date: data.date,
      }));
      setAllEntries(mappedEntries);
    } catch (error) {
      console.error('Error fetching all entries:', error);
    }
  }, [filter, filterColumn, entriesPerPage, corpIdx, totalPages]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (totalPages > 0) {
      fetchAllEntries();
    }
  }, [totalPages, fetchAllEntries]);

  /**
   * 개별 체크박스 변경 핸들러
   * @param {number} index - 변경할 항목의 인덱스
   */
  const handleCheckboxChange = (index) => {
    setSelectedEntries((prevSelectedEntries) => {
      const newSelectedEntries = [...prevSelectedEntries];
      if (newSelectedEntries.includes(index)) {
        return newSelectedEntries.filter((i) => i !== index);
      } else {
        newSelectedEntries.push(index);
        return newSelectedEntries;
      }
    });
  };

  /**
   * 행 클릭 핸들러
   * @param {number} index - 클릭한 행의 인덱스
   */
  const handleRowClick = (index) => {
    handleCheckboxChange(index);
  };

  /**
   * 전체 선택 체크박스 변경 핸들러
   */
  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      if (newSelectAll) {
        setSelectedEntries(entries.map((_, index) => index));
      } else {
        setSelectedEntries([]);
      }
      return newSelectAll;
    });
  };

  /**
   * 전역 전체 선택 체크박스 변경 핸들러
   */
  const handleGlobalSelectAllChange = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      if (newSelectAll) {
        setSelectedEntries(allEntries.map((_, index) => index));
      } else {
        setSelectedEntries([]);
      }
      return newSelectAll;
    });
  };

  /**
   * 데이터 내보내기 핸들러
   */
  const handleExport = () => {
    const exportData = selectedEntries.map((index) => allEntries[index]).map((entry) => ({
      date: entry.date,
      type: entry.type,
      productCode: entry.productCode,
      productName: entry.productName,
      quantity: entry.quantity,
      company: entry.company,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Entries');
    XLSX.writeFile(workbook, 'stock_entries.xlsx');
  };

  /**
   * 페이지 변경 핸들러
   * @param {Event} event - 이벤트 객체
   * @param {number} value - 새로운 페이지 번호
   */
  const handleChangePage = (event, value) => {
    setPage(value);
    setSelectAll(false);
  };

  /**
   * 필터 값 변경 핸들러
   * @param {Event} e - 이벤트 객체
   */
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
    setSelectAll(false);
  };

  /**
   * 필터 컬럼 변경 핸들러
   * @param {Event} e - 이벤트 객체
   */
  const handleFilterColumnChange = (e) => {
    setFilterColumn(e.target.value);
    setPage(1);
    setSelectAll(false);
  };

  return (
    <div className={`${style.tableContainer} ${darkMode ? 'dark-mode' : ''}`}>
      {/* 헤더 컨테이너 */}
      <div className={style.headerContainer}>
        <h2 className={style.title}>입출고 내역</h2>
        {/* 필터 컨테이너 */}
        <div className={style.filterContainer}>
          {/* 필터 컬럼 선택 */}
          <DarkModeFormControl variant="outlined" size="small" className={style.filterColumnSelect} darkMode={darkMode}>
            <DarkModeSelect
              id="filter-column"
              value={filterColumn}
              onChange={handleFilterColumnChange}
              displayEmpty
              MenuProps={menuProps}
              darkMode={darkMode}
            >
              {filterColumns.map((column) => (
                <MenuItem key={column.value} value={column.value}>
                  {column.label}
                </MenuItem>
              ))}
            </DarkModeSelect>
          </DarkModeFormControl>
          {/* 필터 입력 필드 */}
          {filterColumn === 'date' ? (
            <DarkModeTextField
              variant="outlined"
              size="small"
              type="date"
              value={filter}
              onChange={handleFilterChange}
              className={style.searchInput}
              placeholder="날짜 선택"
              darkMode={darkMode}
            />
          ) : (
            <DarkModeTextField
              variant="outlined"
              size="small"
              value={filter}
              onChange={handleFilterChange}
              className={style.searchInput}
              placeholder="검색어 입력"
              darkMode={darkMode}
            />
          )}
        </div>
        {/* 버튼 컨테이너 */}
        <ButtonContainer>
          {/* 전역 전체 선택 버튼 */}
          <CustomButton onClick={handleGlobalSelectAllChange} className={style.filterButton}>
            전체 선택
          </CustomButton>
          {/* 내보내기 버튼 */}
          <CustomButton onClick={handleExport} className={style.filterButton}>
            내보내기
          </CustomButton>
        </ButtonContainer>
      </div>
      {/* 데이터 테이블 */}
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
                  checked={selectedEntries.includes(index)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(index);
                  }}
                />
              </td>
              <td>{entry.date}</td>
              <td style={{ color: entry.type === '입고' ? 'teal' : 'coral', fontWeight: 'bold' }}>{entry.type}</td>
              <td>{entry.productCode}</td>
              <td>{entry.productName}</td>
              <td>{entry.quantity}</td>
              <td>{entry.company}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <CustomPagination
        count={totalPages}
        page={page}
        onChange={handleChangePage}
        className={`${style.pagination} ${style.darkModePagination}`}
      />
    </div>
  );
};

export default InoutHistory;
