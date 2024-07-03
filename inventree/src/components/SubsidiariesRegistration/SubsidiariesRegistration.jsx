import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import style from './SubsidiariesRegistration.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { Select, MenuItem, TextField, FormControl, Pagination } from '@mui/material';
import { styled } from '@mui/system';
import { useDarkMode } from '../DarkMode/DarkModeContext';

// 다크 모드용 커스텀 텍스트 필드
const DarkModeTextField = styled(TextField)(({ darkMode }) => ({
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
const DarkModeSelect = styled(Select)(({ darkMode }) => ({
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
const DarkModeFormControl = styled(FormControl)(({ darkMode }) => ({
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

// 커스텀 페이징 - 현재 페이지의 스타일을 정의합니다.
const CustomPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  },
  '& .Mui-selected': {
    backgroundColor: '#6fa16f !important',
    color: 'white !important',
  },
  '& .MuiPaginationItem-page:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f0f0f0',
  },
}));

const SubsidiaryRegistration = () => {
  // 상태 변수들
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 여부 상태
  const [subsidiaries, setSubsidiaries] = useState([]); // 업체 데이터 상태
  const [filterColumn, setFilterColumn] = useState(''); // 필터링할 열 상태 변수
  const [filterValue, setFilterValue] = useState(''); // 필터링 값 상태 변수
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태
  const entriesPerPage = 10; // 페이지 당 항목 수
  const { darkMode } = useDarkMode(); // 다크 모드 상태 가져오기

  // 데이터 가져오는 함수
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8090/tree/api/subsidiaries', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      setSubsidiaries(response.data); // 업체 데이터를 상태로 설정
    } catch (error) {
      console.error('업체 데이터를 불러오는 중 오류 발생:', error);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 필터링된 업체 데이터를 반환하는 함수
  const getFilteredSubsidiaries = useCallback(() => {
    return subsidiaries.filter((subsidiary) => {
      if (!filterColumn) return true; // 필터링 열이 없을 경우 모든 데이터 반환
      if (filterColumn === 'isRelease') {
        // 업체분류 필터링 처리
        const filterText = filterValue.toLowerCase();
        const isReleaseText = subsidiary.isRelease === 'Y' ? '출고업체' : '입고업체';
        return isReleaseText.toLowerCase().includes(filterText);
      }
      return subsidiary[filterColumn].toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  }, [subsidiaries, filterColumn, filterValue]);

  // 필터링된 데이터가 변경될 때마다 페이지 수와 현재 페이지를 재설정하는 useEffect
  useEffect(() => {
    const filteredSubsidiaries = getFilteredSubsidiaries();
    setTotalPages(Math.ceil(filteredSubsidiaries.length / entriesPerPage));
  }, [filterColumn, filterValue, subsidiaries, getFilteredSubsidiaries]);

  // 페이지에 따라 데이터를 분할하는 함수
  const paginatedSubsidiaries = useMemo(
    () => getFilteredSubsidiaries().slice((page - 1) * entriesPerPage, page * entriesPerPage),
    [getFilteredSubsidiaries, page, entriesPerPage]
  );

  // 페이지 변경 핸들러
  const handleChangePage = (event, value) => {
    setPage(value);
    setSelectAll(false); // 페이지 변경 시 전체 선택 상태 초기화
  };

  // 필터 컬럼 변경 핸들러
  const handleFilterColumnChange = (event) => {
    setFilterColumn(event.target.value);
    setPage(1); // 필터 컬럼 변경 시 페이지를 1로 설정
  };

  // 필터 값 변경 핸들러
  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
    setPage(1); // 필터 값 변경 시 페이지를 1로 설정
  };

  // 업체 정보 업데이트 함수
  const updateSubsidiaries = async () => {
    const checkedSubsidiaries = subsidiaries.filter((subsidiary) => subsidiary.checked);

    if (checkedSubsidiaries.length === 0) {
      return;
    }

    const changedSubsidiaries = [];

    subsidiaries.forEach((subsidiary) => {
      if (subsidiary.checked) {
        changedSubsidiaries.push({
          subIdx: subsidiary.subIdx,
          subName: subsidiary.subName,
          subOwner: subsidiary.subOwner,
          subTel: subsidiary.subTel,
          subAddr: subsidiary.subAddr,
          isRelease: subsidiary.isRelease,
          corpIdx: subsidiary.corpIdx,
        });
      }
    });

    try {
      const updateResponse = await axios.put(
        'http://localhost:8090/tree/api/subsidiaries/update',
        changedSubsidiaries,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Subsidiary data update response:', updateResponse.data);
      alert('저장되었습니다');
      await fetchData(); // 데이터 새로고침
    } catch (error) {
      console.error('Error updating Subsidiary data:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 업체 정보 추가 함수
  const insertSubsidiaries = async () => {
    const newSubsidiaries = subsidiaries.filter((subsidiary) => subsidiary.checked && !subsidiary.subIdx);

    if (newSubsidiaries.length === 0) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8090/tree/api/subsidiaries/insert', newSubsidiaries, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Insert response:', response.data);

      alert('새 업체 데이터가 성공적으로 추가되었습니다.');
      await fetchData(); // 데이터 새로고침
    } catch (error) {
      console.error('Error inserting data:', error);
      alert('데이터 삽입 중 오류가 발생했습니다.');
    }
  };

  // 선택된 업체 정보 저장 함수
  const SelectedSave = async () => {
    await updateSubsidiaries();
    await insertSubsidiaries();
  };

  // 업체 정보 삭제 함수
  const deleteSubsidiaries = async () => {
    const checkedSubsidiaries = getFilteredSubsidiaries().filter((subsidiary) => subsidiary.checked);

    if (checkedSubsidiaries.length === 0) {
      alert('삭제할 업체를 선택해주세요.');
      return;
    }

    try {
      const response = await axios.put('http://localhost:8090/tree/api/subsidiaries/delete', checkedSubsidiaries, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response:', JSON.stringify(response.data, null, 2));
      
      alert('삭제 요청이 처리되었습니다. 잠시 후 결과를 확인합니다.');

      setTimeout(async () => {
        await fetchData();
        alert('데이터가 갱신되었습니다. 삭제 결과를 확인해주세요.');
      }, 2000);

    } catch (error) {
      console.error('Error deleting data:', error);
      alert('데이터 삭제 요청 중 오류가 발생했습니다.');
    }
  };

  // 새로운 업체 등록 행 추가
  const addSubsidiary = () => {
    const newSubsidiary = {
      checked: false,
      subName: '',
      subOwner: '',
      subTel: '',
      subAddr: '',
      isRelease: '',
      subIdx: '',
    };

    setSubsidiaries((prevSubsidiaries) => [...prevSubsidiaries, newSubsidiary]);
  };

  // 개별 체크박스 토글
  const handleCheckboxToggle = (index, checked) => {
    const newSubsidiaries = [...subsidiaries];
    newSubsidiaries[index].checked = checked;
    setSubsidiaries(newSubsidiaries);
  };

  // 입력 값 변경 함수
  const handleInputChange = (index, field, value) => {
    const newSubsidiaries = [...subsidiaries];
    newSubsidiaries[index][field] = value;
    setSubsidiaries(newSubsidiaries);
  };

  // 현재 페이지의 데이터 선택/해제 함수
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const filteredSubsidiaries = getFilteredSubsidiaries();
    const updatedSubsidiaries = subsidiaries.map(subsidiary => {
      if (filteredSubsidiaries.some(filtered => filtered.subIdx === subsidiary.subIdx)) {
        return { ...subsidiary, checked: newSelectAll };
      }
      return subsidiary;
    });
    setSelectAll(newSelectAll);
    setSubsidiaries(updatedSubsidiaries);
  };

  // 파일 가져오기 (import) 함수
  const importSelected = () => {
    const input = document.createElement('input');

    // isRelease 값을 '출고업체'일 때 'Y', '입고업체'일 때 'N'으로 매핑하는 함수
    const mapIsRelease = (value) => {
      if (value === '출고업체') {
        return 'Y';
      } else if (value === '입고업체') {
        return 'N';
      }
      return '';
    };

    input.type = 'file';
    input.accept = '.xlsx, .xls, .pdf';
    input.style.display = 'none';

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const importedData = XLSX.utils.sheet_to_json(worksheet);

          const newSubsidiaries = importedData
            .map((item, index) => ({
              checked: false,
              subName: item['업체명'] || '',
              subOwner: item['업체대표자'] || '',
              subTel: item['업체전화번호'] || '',
              subAddr: item['업체주소'] || '',
              isRelease: mapIsRelease(item['업체분류']) || '',
            }))
            .filter((subsidiary) => subsidiary.subName !== '');

          setSubsidiaries((prevSubsidiaries) => [...prevSubsidiaries, ...newSubsidiaries]);
          alert('파일이 성공적으로 가져와졌습니다.');
        } catch (error) {
          console.error('Error processing file:', error);
          alert('파일 처리 중 오류가 발생했습니다.');
        }
      };

      reader.readAsArrayBuffer(file);
    };

    input.click();
  };

  // 선택된 데이터 내보내기 (export) 함수
  const exportSelected = async () => {
    const filteredSubsidiaries = getFilteredSubsidiaries();
    const checkedSubsidiaries = filteredSubsidiaries.filter((subsidiary) => subsidiary.checked);
    if (checkedSubsidiaries.length === 0) {
      alert('내보낼 행을 선택해주세요.');
      return;
    }

    const exportData = checkedSubsidiaries.map((row) => ({
      업체명: row.subName,
      업체대표자: row.subOwner,
      업체전화번호: row.subTel,
      업체주소: row.subAddr,
      업체분류: row.isRelease === 'Y' ? '출고업체' : '입고업체',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'exported_data.xlsx');
    console.log('Exporting data to Excel or PDF');
  };

  return (
    <div className={`${style.tableContainer} ${darkMode ? 'dark-mode' : ''}`}>
      <div className="tableContainer">
        <div className={style.headerContainer}>
          <h2>업체 등록</h2>
          <div className={style.searchFilterContainer}>
            <div className={style.searchInputContainer}>
              <DarkModeFormControl
                variant="outlined"
                size="small"
                className={style.filterColumnSelect}
                darkMode={darkMode}
                style={{ marginRight: '10px' }} // 필터 컬럼과 필터 입력 칸 사이에 간격 추가
              >
                <DarkModeSelect
                  id="filter-column"
                  value={filterColumn}
                  onChange={handleFilterColumnChange}
                  displayEmpty
                  darkMode={darkMode}
                >
                  <MenuItem value="">선택</MenuItem>
                  <MenuItem value="subName">업체명</MenuItem>
                  <MenuItem value="subOwner">업체대표자</MenuItem>
                  <MenuItem value="subTel">업체전화번호</MenuItem>
                  <MenuItem value="subAddr">업체주소</MenuItem>
                  <MenuItem value="isRelease">업체분류</MenuItem>
                </DarkModeSelect>
              </DarkModeFormControl>

              <DarkModeTextField
                type="text"
                size="small"
                variant="outlined"
                value={filterValue}
                onChange={handleFilterValueChange}
                placeholder="검색어 입력"
                darkMode={darkMode}
              />
            </div>
          </div>
          <div className={style.buttonContainer}>
            <button className={style.defaultButton} onClick={deleteSubsidiaries}>
              <img src={deleteIcon} alt="삭제 아이콘" />
              삭제
            </button>
            <button className={style.defaultButton} onClick={SelectedSave}>
              <img src={saveIcon} alt="저장하기 아이콘" />
              저장
            </button>
            <button className={style.defaultButton} onClick={importSelected}>
              <img src={importIcon} alt="가져오기 아이콘" />
              가져오기
            </button>
            <button className={style.defaultButton} onClick={exportSelected}>
              <img src={exportIcon} alt="내보내기 아이콘" />
              내보내기
            </button>
            <button className={style.addRowButton} onClick={addSubsidiary}>
              +업체추가
            </button>
          </div>
        </div>

        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" className={style.checkbox} checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th>No</th>
              <th>업체명</th>
              <th>업체대표자</th>
              <th>업체전화번호</th>
              <th>업체주소</th>
              <th>업체분류</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubsidiaries.map((subsidiary, index) => (
              <tr
                key={index}
                className={style.tbodyRow}
                onClick={() => handleCheckboxToggle((page - 1) * entriesPerPage + index, !subsidiary.checked)}
              >
                <td>
                  <input
                    type="checkbox"
                    className={style.checkbox}
                    checked={subsidiary.checked || false}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxToggle((page - 1) * entriesPerPage + index, !subsidiary.checked)}
                  />
                </td>
                <td>{index + 1 + (page - 1) * entriesPerPage}</td>
                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={subsidiary.subName}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange((page - 1) * entriesPerPage + index, 'subName', e.target.value)}
                    placeholder="업체명"
                  />
                </td>
                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={subsidiary.subOwner}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange((page - 1) * entriesPerPage + index, 'subOwner', e.target.value)}
                    placeholder="업체대표자"
                  />
                </td>
                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={subsidiary.subTel}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange((page - 1) * entriesPerPage + index, 'subTel', e.target.value)}
                    placeholder="연락처"
                  />
                </td>
                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={subsidiary.subAddr}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange((page - 1) * entriesPerPage + index, 'subAddr', e.target.value)}
                    placeholder="주소"
                  />
                </td>
                <td>
                  <select
                    value={subsidiary.isRelease || ''}
                    className={style.tableInput}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleInputChange((page - 1) * entriesPerPage + index, 'isRelease', e.target.value)
                    }
                  >
                    <option value=""> 선택 </option>
                    <option value="Y">출고</option>
                    <option value="N">입고</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <CustomPagination count={totalPages} page={page} onChange={handleChangePage} className={style.pagination} />
      </div>
    </div>
  );
};

export default SubsidiaryRegistration;
