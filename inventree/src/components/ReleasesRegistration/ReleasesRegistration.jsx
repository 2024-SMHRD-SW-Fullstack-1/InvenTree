import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './ReleasesRegistration.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { useDarkMode } from '../DarkMode/DarkModeContext'; // useDarkMode 훅을 가져옵니다.

/**
 * ReleasesRegistration 컴포넌트
 * 출고 데이터를 등록하고 관리하는 컴포넌트입니다.
 */
const ReleasesRegistration = () => {
  // 상태 변수 선언
  const [rows, setRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [latestReleaseIdx, setLatestReleaseIdx] = useState(0);
  const [products, setProducts] = useState([]);
  const [subsidiaries, setSubsidiaries] = useState([]);
  const corpIdx = localStorage.getItem('corpIdx'); // 현재 로그인한 corpIdx 가져오기
  const { darkMode } = useDarkMode(); // 다크 모드 상태를 가져옵니다.

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/tree/api/products/${corpIdx}`);
        setProducts(response.data);
      } catch (error) {
        console.error('There was an error fetching the products!', error);
      }
    };

    const fetchSubsidiaries = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/tree/api/products/subsidiaries/outgoing/${corpIdx}`);
        setSubsidiaries(response.data);
      } catch (error) {
        console.error('There was an error fetching the subsidiary!', error);
      }
    };

    const fetchReleases = async () => {
      try {
        const response = await axios.get('http://localhost:8090/tree/api/releases');
        const releases = response.data;
        if (releases.length > 0) {
          const maxReleaseIdx = Math.max(...releases.map((release) => release.releaseIdx));
          setLatestReleaseIdx(maxReleaseIdx);
        }
      } catch (error) {
        console.error('There was an error fetching the releases!', error);
      }
    };

    fetchProducts();
    fetchSubsidiaries();
    fetchReleases();
  }, [corpIdx]);

  /**
   * 새로운 행을 추가하는 함수
   * @param {number} index - 추가할 행의 인덱스
   */
  const addRow = (index = rows.length) => {
    const newRow = {
      checked: false,
      date: new Date().toISOString().slice(0, 10),
      number: latestReleaseIdx + 1,
      code: '',
      name: '',
      quantity: '',
      subName: '', // 필드명 변경
    };
    const newRows = [...rows.slice(0, index + 1), newRow, ...rows.slice(index + 1)];
    setRows(newRows);
    setLatestReleaseIdx(latestReleaseIdx + 1);
  };

  /**
   * 체크박스를 토글하는 함수
   * @param {number} index - 토글할 행의 인덱스
   */
  const handleCheckboxToggle = (index) => {
    const newRows = [...rows];
    newRows[index].checked = !newRows[index].checked;
    setRows(newRows);
  };

  /**
   * 입력 값을 변경하는 함수
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
  const deleteCheckedRows = () => {
    const newRows = rows.filter((row) => !row.checked);
    setRows(newRows);
  };

  /**
   * 전체 선택 체크박스를 토글하는 함수
   */
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newRows = rows.map((row) => ({ ...row, checked: newSelectAll }));
    setSelectAll(newSelectAll);
    setRows(newRows);
  };

  /**
   * 데이터를 저장하는 함수
   */
  const handleSave = async () => {
    const checkedRows = rows.filter((row) => row.checked);
    const saveRequests = checkedRows.map((row) => {
      const subsidiary = subsidiaries.find((sub) => sub.subName === row.subName);
      return {
        corpIdx: corpIdx,
        prodBarcode: row.code,
        prodCnt: parseInt(row.quantity, 10),
        subIdx: subsidiary?.subIdx, // 수정된 부분: subIdx를 저장
      };
    });
    console.log(saveRequests); // 전송되는 데이터를 출력하여 확인
    try {
      await axios.post('http://localhost:8090/tree/api/products/release', saveRequests);
      alert('저장되었습니다.');
      // 저장 완료 후 새로고침
      window.location.reload();
    } catch (error) {
      console.error('There was an error saving the data!', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  /**
   * 파일을 가져오는 함수
   * @param {object} event - 이벤트 객체
   */
  const handleImport = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8090/tree/api/excel/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('파일이 성공적으로 업로드 되었습니다.');
        console.log('Received data:', response.data);

        const importedData = response.data.map((data, index) => ({
          checked: false,
          date: new Date().toISOString().slice(0, 10),
          number: latestReleaseIdx + 1 + index,
          code: data.prodBarcode,
          name: data.prodName,
          quantity: data.stockCnt, // 여기서 stockCnt 필드를 quantity로 사용
          subName: data.corpName, // 필드명을 subName으로 수정
        }));
        setRows((prevRows) => [...prevRows, ...importedData]);
        setLatestReleaseIdx(latestReleaseIdx + importedData.length);
      } else {
        alert('파일 업로드 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error importing file!', error);
      alert('파일 업로드 중 오류가 발생했습니다: ' + error.response.data.message);
    }
  };

  /**
   * 데이터를 내보내는 함수
   */
  const handleExport = async () => {
    const checkedRows = rows.filter((row) => row.checked);
    if (checkedRows.length === 0) {
      alert('내보낼 행을 선택해주세요.');
      return;
    }

    const exportData = checkedRows.map((row) => ({
      'Product Barcode': row.code,
      'Product Name': row.name,
      'Release Count': row.quantity,
      Subsidiary: row.subName, // 필드명 변경
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  return (
    <div className={`${style.tableContainer} ${darkMode ? 'dark-mode' : ''}`}>
      <div className={style.headerContainer}>
        <h2 className={style.title}>출고 등록</h2>
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
          <button className={style.addRowButton} onClick={() => addRow(rows.length - 1)}>
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
            <th>출고일</th>
            <th>출고 번호</th>
            <th>제품 코드</th>
            <th>제품명</th>
            <th>출고수량</th>
            <th>출고 업체</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={style.tbodyRow} onClick={() => handleCheckboxToggle(index)}>
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className={style.checkbox}
                  checked={row.checked}
                  onChange={() => handleCheckboxToggle(index)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td>{row.date}</td>
              <td>{row.number}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <select
                  value={row.code}
                  onChange={(e) => {
                    const selectedProduct = products.find((p) => p.prodBarcode === e.target.value);
                    handleInputChange(index, 'code', e.target.value);
                    handleInputChange(index, 'name', selectedProduct ? selectedProduct.prodName : '');
                  }}
                  className={style.selectInput}
                >
                  <option value="">제품코드</option>
                  {products.map((product) => (
                    <option key={product.prodBarcode} value={product.prodBarcode}>
                      {product.prodBarcode}
                    </option>
                  ))}
                </select>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <select
                  value={row.name}
                  onChange={(e) => {
                    const selectedProduct = products.find((p) => p.prodName === e.target.value);
                    handleInputChange(index, 'name', e.target.value);
                    handleInputChange(index, 'code', selectedProduct ? selectedProduct.prodBarcode : '');
                  }}
                  className={style.selectInput}
                >
                  <option value="">제품명</option>
                  {products.map((product) => (
                    <option key={product.prodName} value={product.prodName}>
                      {product.prodName}
                    </option>
                  ))}
                </select>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                  className={style.inputText}
                  placeholder="출고수량"
                />
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <select
                  value={row.subName}
                  onChange={(e) => handleInputChange(index, 'subName', e.target.value)}
                  className={style.selectInput}
                >
                  <option value="">출고업체</option>
                  {subsidiaries
                    .filter((sub) => sub.isRelease === 'Y')
                    .map((sub) => (
                      <option key={sub.subIdx} value={sub.subName}>
                        {sub.subName}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReleasesRegistration;
