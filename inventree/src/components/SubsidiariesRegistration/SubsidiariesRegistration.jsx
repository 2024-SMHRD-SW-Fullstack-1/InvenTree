import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './SubsidiariesRegistration.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { Select, MenuItem, TextField } from '@mui/material';

const SubsidiaryRegistration = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [subsidiaries, setSubsidiaries] = useState([]);

  useEffect(() => {
    let isMounted = true; // 클린업을 위한 플래그

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8090/tree/api/subsidiaries', {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        if (isMounted) {
          setSubsidiaries(response.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('권한 데이터를 불러오는 중 오류 발생:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 플래그 설정
    };
  }, []);

  // 업체 정보 업데이트 함수
  const updateSubsidiaries = async () => {
    const checkedSubsidiaries = subsidiaries.filter((subsidiary) => subsidiary.checked);

    if (checkedSubsidiaries.length === 0) {
      // alert('추가할 권한을 선택해주세요.');
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
        },
      );

      console.log('Subsidiary data update response:', updateResponse.data);
      alert('저장되었습니다');
      window.location.replace('/SubsidiariesRegistration');
    } catch (error) {
      console.error('Error updating Subsidiary data:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 업체 정보 추가 함수
  const insertSubsidiaries = async () => {
    const newSubsidiaries = subsidiaries.filter((subsidiary) => subsidiary.checked && !subsidiary.subIdx);

    if (newSubsidiaries.length === 0) {
      // alert('추가할 새 업체 데이터를 선택해주세요.');
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

      // 성공적으로 삽입된 후 필요한 후속 작업을 여기에 추가
      alert('새 업체 데이터가 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('Error inserting data:', error);
      alert('데이터 삽입 중 오류가 발생했습니다.');
    }
  };

  // 저장 버튼 함수
  const SelectedSave = async () => {
    await updateSubsidiaries();
    await insertSubsidiaries();
  };

  // 업체 정보 삭제 함수
  const deleteSubsidiaries = async () => {
    const checkedSubsidiaries = subsidiaries.filter((subsidiary) => subsidiary.checked);

    if (checkedSubsidiaries.length === 0) {
      // alert('삭제할 업체 데이터를 선택해주세요.');
      return;
    }
    console.log(checkedSubsidiaries);
    try {
      const response = await axios.put('http://localhost:8090/tree/api/subsidiaries/delete', checkedSubsidiaries, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response:', response.data);

      // alert('선택된 업체 데이터가 성공적으로 삭제되었습니다.');

      // setSubsidiaries(checkedSubsidiaries);
    } catch (error) {
      if (error.response) {
        // 서버가 오류 응답을 보낸 경우
        console.error('Error deleting data:', error.response.data);
        alert(`상품이 있는 업체들은 삭제되지 않습니다.`);
      } else if (error.request) {
        // 요청이 완료되지 않은 경우
        console.error('Request not completed:', error.request);
        // alert('서버로의 요청이 완료되지 않았습니다.');
      } else {
        // 그 외의 오류 처리
        console.error('Error deleting data2:', error.message);
        alert('데이터 삭제 중 오류가 발생했습니다.');
      }
    }
    window.location.replace('/SubsidiariesRegistration');
  };

  // 업체 등록 행 추가
  const addSubsidiary = () => {
    setSubsidiaries([
      ...subsidiaries,
      {
        checked: false,
        subName: '',
        subOwner: '',
        subTel: '',
        subAddr: '',
        isRelease: '',
      },
    ]);
  };

  // 개별 checkbox toggle
  const handleCheckboxToggle = (index) => {
    if (subsidiaries[index]) {
      // index 범위 검사 추가
      const newSubsidiaries = [...subsidiaries];
      newSubsidiaries[index].checked = !newSubsidiaries[index].checked;
      setSubsidiaries(newSubsidiaries);
    }
  };

  // 입력 값 변경 함수
  const handleInputChange = (index, field, value) => {
    const newSubsidiaries = [...subsidiaries];
    newSubsidiaries[index][field] = value;
    setSubsidiaries(newSubsidiaries);
  };

  // 전체 선택 함수
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newSubsidiaries = subsidiaries.map((subsidiary) => ({ ...subsidiary, checked: newSelectAll }));
    setSelectAll(newSelectAll);
    setSubsidiaries(newSubsidiaries);
  };

  // 파일 가져오기 (import)
  const importSelected = () => {
    const input = document.createElement('input');

    // isRelease 값을 '출고업체'일 때 'Y', '입고업체'일 때 'N'으로 매핑하는 함수
    const mapIsRelease = (value) => {
      if (value === '출고업체') {
        return 'Y';
      } else if (value === '입고업체') {
        return 'N';
      }
      // 기타 경우에 대한 처리를 원하면 필요에 따라 추가
      return ''; // 예외 처리: 매핑할 값이 없는 경우 빈 문자열 반환
    };

    input.type = 'file';
    input.accept = '.xlsx, .xls, .pdf';
    input.style.display = 'none'; // 화면에 보이지 않도록 설정

    // 파일 선택 시 동작
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
            .filter((subsidiary) => subsidiary.subName !== ''); // 필터링 추가

          setSubsidiaries((prevSubsidiaries) => [...prevSubsidiaries, ...newSubsidiaries]);
          alert('파일이 성공적으로 가져와졌습니다.');
        } catch (error) {
          console.error('Error processing file:', error);
          alert('파일 처리 중 오류가 발생했습니다.');
        }
      };

      reader.readAsArrayBuffer(file);
    };

    // 파일 선택 창을 열지 않고 바로 파일 선택 기능 실행
    input.click();
  };

  // 선택된 데이터 내보내기 (export)
  const exportSelected = async () => {
    const checkedSubsidiaries = subsidiaries.filter((subsidiary) => subsidiary.checked);
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
    <div className={style.tableContainer}>
      <div className={style.headerContainer}>
        <h2 className={style.title}>업체 등록</h2>
        <div className={style.buttonContainer}>
          <button className={`${style.defaultButton} ${style.deleteButton}`} onClick={deleteSubsidiaries}>
            <img src={deleteIcon} alt="삭제 아이콘" />
            삭제
          </button>
          <button className={`${style.defaultButton} ${style.saveButton}`} onClick={SelectedSave}>
            {/* onClick={handleSave} */}
            <img src={saveIcon} alt="저장하기 아이콘" />
            저장하기
          </button>
          <button className={`${style.defaultButton} ${style.importButton}`} onClick={importSelected}>
            <img src={importIcon} alt="가져오기 아이콘" />
            가져오기
          </button>
          <button className={`${style.defaultButton} ${style.exportButton}`} onClick={exportSelected}>
            <img src={exportIcon} alt="내보내기 아이콘" />
            내보내기
          </button>
          <button className={style.addRowButton} onClick={addSubsidiary}>
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
            <th>No</th>
            <th>업체명</th>
            <th>업체대표자</th>
            <th>업체전화번호</th>
            <th>업체주소</th>
            <th>업체분류</th>
          </tr>
        </thead>
        <tbody>
          {subsidiaries.map((subsidiary, index) => (
            <tr key={index} className={style.tbody}>
              <td>
                <input
                  type="checkbox"
                  className={style.checkbox}
                  defaultChecked={subsidiary.checked || false}
                  onClick={(e) => handleCheckboxToggle(index)}
                />
              </td>
              <td>{index + 1}</td>
              <td>
                <TextField
                  type="text"
                  value={subsidiary.subName}
                  onChange={(e) => handleInputChange(index, 'subName', e.target.value)}
                />
              </td>
              <td>
                <TextField
                  type="text"
                  value={subsidiary.subOwner}
                  onChange={(e) => handleInputChange(index, 'subOwner', e.target.value)}
                />
              </td>
              <td>
                <TextField
                  type="text"
                  value={subsidiary.subTel}
                  onChange={(e) => handleInputChange(index, 'subTel', e.target.value)}
                />
              </td>
              <td>
                <TextField
                  type="text"
                  value={subsidiary.subAddr}
                  onChange={(e) => handleInputChange(index, 'subAddr', e.target.value)}
                />
              </td>
              <td>
                <Select
                  value={subsidiary.isRelease || ''}
                  onChange={(e) => handleInputChange(index, 'isRelease', e.target.value)}
                >
                  <MenuItem value=""> --선택-- </MenuItem>
                  <MenuItem value="Y">출고업체</MenuItem>
                  <MenuItem value="N">입고업체</MenuItem>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubsidiaryRegistration;
