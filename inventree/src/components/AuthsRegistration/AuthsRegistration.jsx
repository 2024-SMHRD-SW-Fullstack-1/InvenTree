import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './AuthsRegistration.module.css';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';

const AuthsRegistration = () => {
  const [auths, setAuths] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); //오류메시지 상태 변수
  const [saveMessage, setSaveMessage] = useState(''); //저장메시지 상태 변수

  useEffect(() => {
    let isMounted = true; // 클린업을 위한 플래그

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8090/tree/api/auths', {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        if (isMounted) {
          setAuths(response.data);
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

  // 오류 메시지 출력 함수
  const handleError = (message) => {
    setErrorMessage(message);
    // 일정 시간 후 오류 메시지를 지우고 싶다면 타이머를 설정할 수 있습니다.
    setTimeout(() => {
      setErrorMessage('');
    }, 5000); // 5초 후에 오류 메시지 지움
  };

  // 오류 메시지 출력 함수
  const handleSaveMessage = (message) => {
    setSaveMessage(message);
    // 일정 시간 후 저장 메시지를 지우고 싶다면 타이머를 설정할 수 있습니다.
    setTimeout(() => {
      setSaveMessage('');
    }, 5000); // 5초 후에 오류 메시지 지움
  };

  // 권한 정보 저장 함수
  const updateSelected = async () => {
    const checkedAuths = auths.filter((auth) => auth.checked);
    if (checkedAuths.length === 0) {
      alert('추가할 권한을 선택해주세요.');
      return;
    }

    const updateData = auths.map((auth) => ({
      authIdx: auth.authIdx,
      mbId: auth.mbId,
      inventoryYn: auth.inventoryYn,
      shipYn: auth.shipYn,
      chartYn: auth.chartYn,
      setYn: auth.setYn,
    }));
    console.log(updateData);
    try {
      const updateResponse = await axios.put('http://localhost:8090/tree/api/auths/update', updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('Auth data update response:', updateResponse.data);
      handleSaveMessage('저장되었습니다');
    } catch (error) {
      console.error('Error updating auth data:', error);
      handleError('저장 중 오류가 발생했습니다.');
    }
  };

  // 행의 모든 권한 값을 토글하는 함수
  const handleTogglePermissions = (index, event) => {
    event.stopPropagation(); // 이벤트 전파 막기
    setAuths((prevAuths) =>
      prevAuths.map((auth, i) => {
        if (i === index) {
          const newValue = auth.inventoryYn === 'Y' ? 'N' : 'Y';
          return {
            ...auth,
            inventoryYn: newValue,
            shipYn: newValue,
            chartYn: newValue,
            setYn: newValue,
          };
        }
        return auth;
      }),
    );
  };

  // 입력 필드 변경 처리
  const handleInputChange = (authsIndex, field, value) => {
    setAuths((prevAuths) =>
      prevAuths.map((auth, index) => (index === authsIndex ? { ...auth, [field]: value } : auth)),
    );
  };

  // 개별 체크박스 토글
  const handleCheckboxToggle = (index) => {
    const updatedAuths = [...auths];
    updatedAuths[index].checked = !updatedAuths[index].checked;
    setAuths(updatedAuths);
  };

  // 전체 선택 토글
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const updatedAuths = auths.map((auth) => ({
      ...auth,
      checked: newSelectAll,
    }));
    setSelectAll(newSelectAll);
    setAuths(updatedAuths);
  };

  // 파일 가져오기 (import)
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

          const newAuths = importedData.map((item, index) => ({
            checked: false,
            mbId: item['아이디'] || '',
            mbName: item['이름'] || '',
            inventoryYn: item['재고권한'] || '',
            shipYn: item['입출고권한'] || '',
            chartYn: item['통계권한'] || '',
            setYn: item['설정권한'] || '',
          }));

          setAuths((prevAuths) => [...prevAuths, ...newAuths]);
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

  // 선택된 데이터 내보내기 (export)
  const exportSelected = async () => {
    const checkedAuths = auths.filter((auths) => auths.checked);
    if (checkedAuths.length === 0) {
      alert('내보낼 행을 선택해주세요.');
      return;
    }

    const exportData = checkedAuths.map((auths) => ({
      아이디: auths.mbId,
      이름: auths.mbName,
      재고권한: auths.inventoryYn,
      입출고권한: auths.shipYn,
      통계권한: auths.chartYn,
      설정권한: auths.setYn,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'exported_data.xlsx');
    console.log('Exporting data to Excel or PDF');
  };

  const handleRowClick = (event, index) => {
    if (event.target.tagName.toLowerCase() !== 'input' && event.target.tagName.toLowerCase() !== 'select') {
      handleCheckboxToggle(index);
    }
  };

  return (
    <div className={style.tableContainer}>
      <div className="tableContainer">
        <div className={style.headerContainer}>
          <h2>권한등록</h2>

          <div className={style.buttonContainer}>
            {errorMessage && <div className={`${style.messageContainer} ${style.errorMessage}`}>{errorMessage}</div>}
            {saveMessage && <div className={`${style.messageContainer} ${style.saveMessage}`}>{saveMessage}</div>}
            <button onClick={updateSelected} className={style.defaultButton}>
              <img src={saveIcon} align="top" alt="저장 아이콘" />
              저장하기
            </button>
            <button onClick={importSelected} className={style.defaultButton}>
              <img src={importIcon} align="top" alt="가져오기 아이콘" />
              가져오기
            </button>
            <button onClick={exportSelected} className={style.defaultButton}>
              <img src={exportIcon} align="top" alt="내보내기 아이콘" />
              내보내기
            </button>
            {/* <button className={style.addRowButton} onClick={addAuths}>
              + 권한
            </button> */}
          </div>
        </div>

        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <input type="checkbox" className={style.checkbox} checked={selectAll} onChange={handleSelectAll} />
              </th>
              {/* <th>No</th> */}
              <th>아이디</th>
              <th>이름</th>
              <th>재고권한</th>
              <th>입출고권한</th>
              <th>통계권한</th>
              <th>설정권한</th>
              <th>변경</th>
            </tr>
          </thead>
          <tbody>
            {auths.map((auth, index) => (
              <tr key={index} onClick={(event) => handleRowClick(event, index)}>
                <td>
                  <input
                    type="checkbox"
                    className={style.checkbox}
                    checked={auth.checked || false}
                    onChange={() => handleCheckboxToggle(index)}
                  />
                </td>
                {/* <td>{index + 1}</td> */}
                <td>{auth.mbId}</td>
                <td>{auth.mbName}</td>
                <td>
                  <select
                    value={auth.inventoryYn}
                    onChange={(e) => handleInputChange(index, 'inventoryYn', e.target.value)}
                    className={style.tableInput}
                  >
                    <option value="/">선택하세요</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </td>
                <td>
                  <select
                    type="text"
                    value={auth.shipYn}
                    onChange={(e) => handleInputChange(index, 'shipYn', e.target.value)}
                    className={style.tableInput}
                  >
                    <option value="/">선택하세요</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </td>
                <td>
                  <select
                    type="text"
                    value={auth.chartYn}
                    onChange={(e) => handleInputChange(index, 'chartYn', e.target.value)}
                    className={style.tableInput}
                  >
                    <option value="/">선택하세요</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </td>
                <td>
                  <select
                    type="text"
                    value={auth.setYn}
                    onChange={(e) => handleInputChange(index, 'setYn', e.target.value)}
                    className={style.tableInput}
                  >
                    <option value="/">선택하세요</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </td>
                <td>
                  <div>
                    <Button className={style.defaultButton} onClick={(e) => handleTogglePermissions(index, e)}>
                      {auth.inventoryYn === 'Y' ? 'All N' : 'All Y'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthsRegistration;
