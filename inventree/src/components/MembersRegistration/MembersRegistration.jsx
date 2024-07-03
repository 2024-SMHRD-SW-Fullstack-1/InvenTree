import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './MembersRegistration.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { useDarkMode } from '../DarkMode/DarkModeContext';

// 정규 표현식을 사용하여 ID와 비밀번호의 패턴을 설정
const ID_PATTERN = /^[A-Za-z0-9+_.-]{4,20}$/; // 4~20자의 영숫자 및 특수문자
const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,20}$/; // 숫자, 문자, 특수문자가 포함된 8~20자 비밀번호

/**
 * MembersRegistration 컴포넌트
 * 사용자 등록, 삭제, 가져오기, 내보내기 기능을 제공하는 컴포넌트입니다.
 */
const MembersRegistration = () => {
  const [rows, setRows] = useState([]); // 사용자 데이터 행을 저장하는 상태 변수
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 체크박스 상태 변수
  const [loading, setLoading] = useState(true); // 로딩 상태 변수
  const { darkMode } = useDarkMode(); // 다크 모드 상태를 가져옴
  const [corpIdx, setCorpIdx] = useState(''); // 회사 인덱스 상태 변수

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchData('http://localhost:8090/tree/api/members', setRows);
    const storedCorpIdx = localStorage.getItem('corpIdx');
    if (storedCorpIdx) {
      setCorpIdx(storedCorpIdx);
    }
  }, []);

  /**
   * 데이터를 가져오는 비동기 함수
   * @param {string} url - 데이터를 가져올 API URL
   * @param {Function} setData - 데이터를 설정할 함수
   */
  const fetchData = async (url, setData) => {
    try {
      setLoading(true);
      console.log(`Fetching data from ${url}`);
      const response = await axios.get(url, { withCredentials: true });
      console.log('Raw fetched data:', response.data);
      setData(response.data.filter((item) => item !== null));
    } catch (error) {
      console.error(`There was an error fetching data from ${url}!`, error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 새로운 행을 추가하는 함수
   */
  const addRow = () => {
    setRows([...rows, createNewRow()]);
  };

  /**
   * 새로운 빈 행 객체를 생성하는 함수
   * @returns {Object} 새로 생성된 빈 행 객체
   */
  const createNewRow = () => ({
    checked: false,
    corpIdx: corpIdx,
    mbId: '',
    mbPw: '',
    mbName: '',
    mbPhone: '',
    authIdx: '',
    joinedAt: '',
  });

  /**
   * 개별 체크박스 상태를 토글하는 함수
   * @param {number} index - 토글할 행의 인덱스
   */
  const handleCheckboxToggle = (index) => {
    const newRows = [...rows];
    if (newRows[index]) {
      newRows[index].checked = !newRows[index].checked;
      setRows(newRows);
    }
  };

  /**
   * 입력 필드의 값을 변경하는 함수
   * @param {number} index - 변경할 행의 인덱스
   * @param {string} field - 변경할 필드명
   * @param {string} value - 변경할 값
   */
  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  /**
   * 선택된 행을 삭제하는 함수
   */
  const deleteCheckedRows = async () => {
    const checkedRows = rows.filter((row) => row.checked);
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8090/tree/api/members/delete', checkedRows, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setRows(rows.filter((row) => !row.checked));
        alert('삭제되었습니다.');
      } else {
        alert(`삭제 중 오류가 발생했습니다: ${response.data?.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('There was an error deleting the data!', error);
      alert(`삭제 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 전체 선택 체크박스 상태를 토글하는 함수
   */
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newRows = rows.map((row) => ({ ...row, checked: newSelectAll }));
    setSelectAll(newSelectAll);
    setRows(newRows);
  };

  /**
   * 선택된 행을 저장하는 함수
   */
  const handleSave = async () => {
    const checkedRows = rows.filter((row) => row.checked);
  
    if (!validateRows()) {
      return;
    }
  
    const memberWithAuthList = checkedRows.map((row) => ({
      member: {
        mbId: row.mbId,
        mbPw: row.mbPw,
        mbName: row.mbName,
        mbPhone: row.mbPhone,
        corpIdx: row.corpIdx,
        joinedAt: row.joinedAt,
        isAdmin: row.isAdmin,
      },
      auth: {
        mbId: row.mbId,
        inventoryYn: row.inventoryYn || 'N',
        shipYn: row.shipYn || 'N',
        chartYn: row.chartYn || 'N',
        setYn: row.setYn || 'N',
      },
    }));
  
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8090/tree/api/members/save', memberWithAuthList, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert('저장되었습니다.');
        window.location.reload();
      } else {
        alert(`저장 중 오류가 발생했습니다: ${response.data?.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('데이터 저장 중 오류 발생!', error);
      alert(`저장 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 엑셀 파일을 읽고 데이터를 가져오는 함수
   * @param {Object} event - 파일 입력 이벤트 객체
   */
  const handleImport = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const importedRows = jsonData.map((data) => ({
        checked: false,
        corpIdx: corpIdx,
        mbId: data['아이디'] || '',
        mbPw: data['비밀번호'] || '',
        mbName: data['이름'] || '',
        mbPhone: data['전화번호'] || '',
        authIdx: data['권한등급'] || '',
        joinedAt: data['가입일자'] || '',
      }));

      setRows((prevRows) => [...prevRows, ...importedRows]);
      alert('파일이 성공적으로 업로드 되었습니다.');
    };

    reader.readAsArrayBuffer(file);
  };

  /**
   * 선택된 데이터를 엑셀 파일로 내보내는 함수
   */
  const handleExport = () => {
    const checkedRows = rows.filter((row) => row.checked);
    if (checkedRows.length === 0) {
      alert('내보낼 행을 선택해주세요.');
      return;
    }

    const exportData = checkedRows.map((row) => ({
      회사코드: row.corpIdx,
      아이디: row.mbId,
      비밀번호: row.mbPw,
      이름: row.mbName,
      전화번호: row.mbPhone,
      가입일자: row.joinedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  /**
   * 행 데이터 유효성을 검사하는 함수
   * @returns {boolean} 유효한 경우 true, 그렇지 않은 경우 false
   */
  const validateRows = () => {
    const duplicateIds = checkDuplicates(rows, 'mbId');
    const duplicatePhones = checkDuplicates(rows, 'mbPhone');
    let errorMessage = '';

    if (duplicateIds.length > 0) {
      errorMessage += `중복된 아이디가 있습니다\n입력된 아이디: ${duplicateIds.join(', ')}\n`;
    }

    if (duplicatePhones.length > 0) {
      errorMessage += `중복된 전화번호가 있습니다\n입력된 전화번호: ${duplicatePhones.join(', ')}\n`;
    }

    for (let row of rows) {
      if (!row.checked) continue;

      if (!ID_PATTERN.test(row.mbId)) {
        errorMessage += `아이디는 4~20자의 영숫자 및 특수문자만 가능합니다\n입력된 아이디: ${row.mbId}\n`;
      }

      if (!PASSWORD_PATTERN.test(row.mbPw)) {
        errorMessage += `비밀번호는 숫자, 문자, 특수문자가 포함된 8~20자여야 합니다\n입력된 비밀번호: ${row.mbId}\n`;
      }
    }

    if (errorMessage) {
      alert(errorMessage);
      return false;
    }
    return true;
  };

  /**
   * 행 데이터의 중복을 검사하는 함수
   * @param {Array} rows - 행 데이터 배열
   * @param {string} field - 검사할 필드명
   * @returns {Array} 중복된 필드값 배열
   */
  const checkDuplicates = (rows, field) => {
    const fieldCount = {};
    rows.forEach((row) => {
      if (row[field]) {
        fieldCount[row[field]] = (fieldCount[row[field]] || 0) + 1;
      }
    });
    return Object.keys(fieldCount).filter((fieldValue) => fieldCount[fieldValue] > 1);
  };


  return (
    <div className={`${style.tableContainer} ${darkMode ? 'dark-mode' : ''}`}>
      <div className={style.headerContainer}>
        <h2 className={style.title}>사용자 관리</h2>
        <div className={style.buttonContainer}>
          <button className={`${style.defaultButton} ${style.deleteButton}`} onClick={deleteCheckedRows}>
            <img src={deleteIcon} alt="삭제 아이콘" />
            삭제
          </button>
          <button className={`${style.defaultButton} ${style.saveButton}`} onClick={handleSave}>
            <img src={saveIcon} alt="저장하기 아이콘" />
            저장하기
          </button>
          <input type="file" id="importFile" style={{ display: 'none' }} onChange={handleImport} />
          <button
            className={`${style.defaultButton} ${style.importButton}`}
            onClick={() => document.getElementById('importFile').click()}
          >
            <img src={importIcon} alt="가져오기 아이콘" />
            가져오기
          </button>
          <button className={`${style.defaultButton} ${style.exportButton}`} onClick={handleExport}>
            <img src={exportIcon} alt="내보내기 아이콘" />
            내보내기
          </button>
          <button className={style.addRowButton} onClick={addRow}>
            +행추가
          </button>
        </div>
      </div>

      <table className={style.table}>
        <thead className={style.thead}>
          <tr>
            <th>
              <input type="checkbox" className={style.checkbox} checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>아이디</th>
            <th>비밀번호</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>가입일자</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            (row, index) =>
              row && (
                <tr key={index} onClick={() => handleCheckboxToggle(index)} className={style.tbody}>
                  <td>
                    <input
                      type="checkbox"
                      className={style.checkbox}
                      checked={row.checked || false}
                      onChange={() => handleCheckboxToggle(index)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.mbId}
                      onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                      onChange={(e) => handleInputChange(index, 'mbId', e.target.value)}
                      className={style.inputText}
                      placeholder="아이디"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.mbPw}
                      onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                      onChange={(e) => handleInputChange(index, 'mbPw', e.target.value)}
                      className={style.inputText}
                      placeholder="비밀번호"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.mbName}
                      onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                      onChange={(e) => handleInputChange(index, 'mbName', e.target.value)}
                      className={style.inputText}
                      placeholder="이름"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.mbPhone}
                      onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                      onChange={(e) => handleInputChange(index, 'mbPhone', e.target.value)}
                      className={style.inputText}
                      placeholder="전화번호"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.joinedAt}
                      onClick={(e) => e.stopPropagation()} // 이벤트 전파 중지
                      className={style.inputText}
                      onChange={(e) => handleInputChange(index, 'joinedAt', e.target.value)}
                      placeholder="가입일자"
                    />
                  </td>
                </tr>
              ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembersRegistration;
