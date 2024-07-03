import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './WarehouseRegistration.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { MenuItem, Select, TextField, FormControl, Pagination } from '@mui/material';
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

const WarehouseRegistration = () => {
  const [warehouses, setWarehouses] = useState([]); // 창고 데이터를 저장하는 상태 변수
  const [selectAll, setSelectAll] = useState(false); // 모든 항목 선택 여부 상태 변수
  const [filterColumn, setFilterColumn] = useState(''); // 필터링할 열 상태 변수
  const [filterValue, setFilterValue] = useState(''); // 필터링 값 상태 변수
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태 변수
  const [saveMessage, setSaveMessage] = useState(''); // 저장 메시지 상태 변수
  const [members, setMembers] = useState([]); // 멤버 데이터를 저장하는 상태 변수
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태
  const entriesPerPage = 10; // 페이지 당 항목 수
  const { darkMode } = useDarkMode(); // 다크 모드 상태 가져오기

  const fetchData = async (pageNumber = 1) => {
    try {
      const response = await axios.get('http://localhost:8090/tree/api/warehouse', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index,
      }));

      setWarehouses(dataWithId);

      const membersResponse = await axios.get('http://localhost:8090/tree/api/warehouse/members', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      setMembers(membersResponse.data);
      setPage(pageNumber); // 현재 페이지 설정
      console.log('Members data:', JSON.stringify(membersResponse.data, null, 2)); // 멤버 데이터 확인
    } catch (error) {
      console.error('이름 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(getFilteredWarehouses().length / entriesPerPage));
  }, [warehouses, filterColumn, filterValue, entriesPerPage]);

  const handleError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const handleSaveMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => {
      setSaveMessage('');
    }, 5000);
  };

  const getFilteredWarehouses = () => {
    return warehouses.filter((warehouse) => {
      if (!filterColumn) return true;
      if (!filterValue) return true;

      if (filterColumn === 'mbName') {
        const member = members.find((member) => member.mbName.toLowerCase().includes(filterValue.toLowerCase()));
        return member ? warehouse.mbId === member.mbId : false;
      }

      return warehouse[filterColumn]?.toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  const paginatedWarehouses = getFilteredWarehouses().slice((page - 1) * entriesPerPage, page * entriesPerPage);

  const handleChangePage = (event, value) => {
    setPage(value);
    setSelectAll(false);
  };

  const handleFilterColumnChange = (event) => {
    setFilterColumn(event.target.value);
    setPage(1);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
    setPage(1);
  };

  const addWarehouse = () => {
    const newWarehouse = {
      id: warehouses.length,
      checked: false,
      bidlName: '',
      mbName: '',
      whAddr: '',
      whStatus: '',
      rackId: '',
      shelfId: '',
      mbId: '',
    };

    setWarehouses([...warehouses, newWarehouse]);
  };

  const handleInputChange = (id, field, value) => {
    const updatedWarehouses = warehouses.map((warehouse) =>
      warehouse.id === id ? { ...warehouse, [field]: value } : warehouse,
    );
    setWarehouses(updatedWarehouses);
  };

  const handleCheckboxToggle = (id) => {
    const updatedWarehouses = warehouses.map((warehouse) =>
      warehouse.id === id ? { ...warehouse, checked: !warehouse.checked } : warehouse,
    );
    setWarehouses(updatedWarehouses);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const filteredWarehouses = getFilteredWarehouses();
    const updatedWarehouses = warehouses.map((warehouse) => {
      if (filterColumn && filterValue) {
        if (filteredWarehouses.includes(warehouse)) {
          return { ...warehouse, checked: newSelectAll };
        }
        return warehouse;
      }
      return { ...warehouse, checked: newSelectAll };
    });
    setSelectAll(newSelectAll);
    setWarehouses(updatedWarehouses);
  };

  const deleteSelectedData = async () => {
    const checkedWarehouses = getFilteredWarehouses().filter((warehouse) => warehouse.checked);

    if (checkedWarehouses.length === 0) {
      handleError('삭제할 데이터를 선택해주세요.');
      return;
    }
    if (window.confirm('정말 삭제하시겠습니까? \n확인을 누르면 되돌릴 수 없습니다.')) {
      const loginWhIdx = [...new Set(checkedWarehouses.map((warehouse) => warehouse.whIdx))];
      const loginShelfIdx = checkedWarehouses
        .map((warehouse) => warehouse.shelfIdx)
        .filter((shelfIdx) => shelfIdx !== undefined);

      const requestData = {
        loginWhIdx,
        loginShelfIdx,
      };

      try {
        const response = await axios.delete('http://localhost:8090/tree/api/warehouse/delete', {
          data: requestData,
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Warehouse and shelf data deleted:', response.data);
        handleSaveMessage('삭제되었습니다.');
        fetchData(page); // 현재 페이지 데이터를 다시 불러옴
      } catch (error) {
        console.error('Error deleting data:', error);
        handleError('데이터 삭제 중 오류가 발생했습니다.');
      }
    } else {
      handleError('삭제를 취소하였습니다.');
      return;
    }
  };

  const insertCheckedData = async () => {
    const checkedData = getFilteredWarehouses().filter((warehouse) => warehouse.checked);
    console.log('Checked data for insertion:', checkedData);

    try {
      for (const data of checkedData) {
        console.log('Sending data:', JSON.stringify(data, null, 2));

        if (data.shelfIdx) {
          console.warn('Skipping data due to existing shelfIdx:', JSON.stringify(data, null, 2));
          continue;
        }

        const shelves = [];

        const { shelfIdx, shelfId, rackId } = data;

        if (shelfIdx || shelfId || rackId) {
          shelves.push({ shelfIdx, shelfId, rackId });
        }

        const payload = {
          ...data,
          shelves,
        };

        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await axios.post('http://localhost:8090/tree/api/warehouse/insert', payload, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });
        console.log('Insert response:', response.data);
      }
      fetchData(page); // 현재 페이지 데이터를 다시 불러옴
    } catch (error) {
      console.error('Error inserting data:', error);
      handleError('데이터 삽입 중 오류가 발생했습니다.');
    }
  };

  const updateWarehouses = async () => {
    const uniqueWarehouses = [];
    const seenWhIdx = new Set();

    getFilteredWarehouses().forEach((warehouse) => {
      if (warehouse.checked && !seenWhIdx.has(warehouse.whIdx)) {
        seenWhIdx.add(warehouse.whIdx);
        uniqueWarehouses.push(warehouse);
      }
    });

    console.log('확인용 : ', JSON.stringify(uniqueWarehouses));
    if (uniqueWarehouses.length === 0) {
      handleError('변경할 내용이 없어요');
      return;
    }

    try {
      const warehouseResponse = await axios.put('http://localhost:8090/tree/api/warehouse/update', uniqueWarehouses, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Warehouse update response:', warehouseResponse.data);
      fetchData(page); // 현재 페이지 데이터를 다시 불러옴
    } catch (error) {
      console.error('Error updating warehouses:', error);
      handleError('창고 데이터 업데이트 중 오류가 발생했습니다.');
    }
  };

  const updateShelves = async () => {
    const changedShelves = [];

    getFilteredWarehouses().forEach((warehouse) => {
      if (warehouse.checked) {
        changedShelves.push({
          shelfId: warehouse.shelfId,
          shelfIdx: warehouse.shelfIdx,
          rackId: warehouse.rackId,
          whIdx: warehouse.whIdx,
        });
      }
    });

    if (changedShelves.length === 0) {
      return;
    }

    try {
      const shelfResponse = await axios.put('http://localhost:8090/tree/api/shelf/update', changedShelves, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Shelf update response:', shelfResponse.data);
      fetchData(page); // 현재 페이지 데이터를 다시 불러옴
    } catch (error) {
      handleError('선반 데이터 업데이트 중 오류가 발생했습니다.');
      console.error('Error updating shelves:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateWarehouses();
      await updateShelves();
      await insertCheckedData();

      handleSaveMessage('저장되었습니다.');
    } catch (error) {
      console.error('Error during save operation:', error);
      handleError('저장 중 오류가 발생했습니다.');
    }
  };

  const handleManagerChange = (whIdx, newMbName) => {
    const newMbId = members.find((member) => member.mbName === newMbName)?.mbId;

    const updatedWarehouses = warehouses.map((warehouse) => {
      if (warehouse.whIdx === whIdx) {
        return { ...warehouse, mbName: newMbName, mbId: newMbId };
      }
      return warehouse;
    });

    setWarehouses(updatedWarehouses);
  };

  const importSelected = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls, .pdf';

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

          const newWarehouses = importedData.map((item, index) => {
            const mbName = item['담당자'] || '';
            const mbId = members.find((member) => member.mbName === mbName)?.mbId || '';

            return {
              id: warehouses.length + index,
              checked: false,
              bidlName: item['창고이름'] || '',
              rackId: item['랙이름'] || '',
              shelfId: item['선반이름'] || '',
              mbName: mbName,
              mbId: mbId,
              whAddr: item['창고주소'] || '',
              whStatus: item['창고상태'] || '',
            };
          });

          setWarehouses((prevWarehouses) => [...prevWarehouses, ...newWarehouses]);
          handleSaveMessage('파일이 성공적으로 가져와졌습니다.');
        } catch (error) {
          console.error('Error processing file:', error);
          handleError('파일 처리 중 오류가 발생했습니다.');
        }
      };

      reader.readAsArrayBuffer(file);
    };

    input.click();
  };

  const exportSelected = async () => {
    let checkedWarehouses = getFilteredWarehouses().filter((warehouse) => warehouse.checked);
    
    if (filterColumn && filterValue) {
      checkedWarehouses = getFilteredWarehouses();
    } else if (checkedWarehouses.length === 0) {
      checkedWarehouses = warehouses;
    }

    if (checkedWarehouses.length === 0) {
      handleError('내보낼 행을 선택해주세요.');
      return;
    }

    const exportData = checkedWarehouses.map((warehouse) => ({
      창고이름: warehouse.bidlName,
      랙이름: warehouse.rackId,
      선반이름: warehouse.shelfId,
      담당자: members.find((member) => member.mbId === warehouse.mbId)?.mbName || '',
      창고주소: warehouse.whAddr,
      창고상태: warehouse.whStatus,
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
          <h2>창고등록</h2>
          <div className={style.searchFilterContainer}>
            <div className={style.searchInputContainer}>
              <DarkModeFormControl
                variant="outlined"
                size="small"
                className={style.filterColumnSelect}
                darkMode={darkMode}
              >
                <DarkModeSelect
                  id="filter-column"
                  style={{ marginRight: '10px' }} // 필터 컬럼과 필터 입력 칸 사이에 간격 추가
                  value={filterColumn}
                  onChange={handleFilterColumnChange}
                  displayEmpty
                  darkMode={darkMode}
                >
                  <MenuItem value="">선택</MenuItem>
                  <MenuItem value="bidlName">창고이름</MenuItem>
                  <MenuItem value="rackId">랙이름</MenuItem>
                  <MenuItem value="shelfId">선반이름</MenuItem>
                  <MenuItem value="mbName">담당자</MenuItem>
                  <MenuItem value="whAddr">창고주소</MenuItem>
                  <MenuItem value="whStatus">창고상태</MenuItem>
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
          <div>
            {errorMessage && <div className={`${style.messageContainer} ${style.errorMessage}`}>{errorMessage}</div>}
            {saveMessage && <div className={`${style.messageContainer} ${style.saveMessage}`}>{saveMessage}</div>}
            <div className={style.buttonContainer}>
              <button onClick={deleteSelectedData} className={style.defaultButton}>
                <img src={deleteIcon} align="top" alt="삭제 아이콘" />
                삭제
              </button>
              <button onClick={handleSave} className={style.defaultButton}>
                <img src={saveIcon} align="top" alt="저장 아이콘" />
                저장
              </button>
              <button onClick={importSelected} className={style.defaultButton}>
                <img src={importIcon} align="top" alt="가져오기 아이콘" />
                가져오기
              </button>
              <button onClick={exportSelected} className={style.defaultButton}>
                <img src={exportIcon} align="top" alt="내보내기 아이콘" />
                내보내기
              </button>
              <button className={style.addRowButton} onClick={addWarehouse}>
                행 추가
              </button>
            </div>
          </div>
        </div>

        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" className={style.checkbox} checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th>창고이름</th>
              <th>랙이름</th>
              <th>선반이름</th>
              <th>담당자</th>
              <th>창고주소</th>
              <th>창고상태</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWarehouses.map((warehouse, index) => (
              <tr key={warehouse.id} className={style.tbodyRow} onClick={() => handleCheckboxToggle(warehouse.id)}>
                <td>
                  <input
                    type="checkbox"
                    className={style.checkbox}
                    checked={warehouse.checked || false}
                    onChange={() => handleCheckboxToggle(warehouse.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={warehouse.bidlName || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange(warehouse.id, 'bidlName', e.target.value)}
                    placeholder="창고이름"
                  />
                </td>
                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={warehouse.rackId || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange(warehouse.id, 'rackId', e.target.value)}
                    placeholder="랙이름"
                  />
                </td>
                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={warehouse.shelfId || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange(warehouse.id, 'shelfId', e.target.value)}
                    placeholder="선반이름"
                  />
                </td>
                <td>
                  <select
                    value={members.find((member) => member.mbId === warehouse.mbId)?.mbName || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const newMbName = e.target.value;
                      handleManagerChange(warehouse.whIdx, newMbName);
                    }}
                    className={style.selectInput}
                  >
                    <option value="">담당자선택</option>
                    {members.map((member, idx) => (
                      <option key={idx} value={member.mbName}>
                        {member.mbName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className={style.tableInput}
                    value={warehouse.whAddr}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange(warehouse.id, 'whAddr', e.target.value)}
                    placeholder="창고주소"
                  />
                </td>
                <td>
                  <input
                    className={style.tableInput}
                    type="text"
                    value={warehouse.whStatus}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleInputChange(warehouse.id, 'whStatus', e.target.value)}
                    placeholder="창고상태"
                  />
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

export default WarehouseRegistration;
