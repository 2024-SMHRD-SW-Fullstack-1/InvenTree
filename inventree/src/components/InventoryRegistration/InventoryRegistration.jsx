import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDarkMode } from '../DarkMode/DarkModeContext'; // useDarkMode 훅을 가져옵니다.
import styles from './InventoryRegistration.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';

const InventoryRegistration = () => {
  // 상태 변수들 선언
  const [rows, setRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [latestStockIdx, setLatestStockIdx] = useState(0);
  const [products, setProducts] = useState([]);
  const [subsidiaries, setSubsidiaries] = useState([]);
  const corpIdx = localStorage.getItem('corpIdx');
  const { darkMode } = useDarkMode(); // 다크 모드 상태를 가져옵니다.

  // 컴포넌트가 마운트될 때 제품, 자회사 및 재고 데이터를 가져옴
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
        const response = await axios.get(`http://localhost:8090/tree/api/products/subsidiaries/incoming/${corpIdx}`);
        setSubsidiaries(response.data);
      } catch (error) {
        console.error('There was an error fetching the subsidiaries!', error);
      }
    };

    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:8090/tree/api/stocks');
        const stocks = response.data;
        if (stocks.length > 0) {
          const maxStockIdx = Math.max(...stocks.map((stock) => stock.stockIdx));
          setLatestStockIdx(maxStockIdx);
        }
      } catch (error) {
        console.error('There was an error fetching the stocks!', error);
      }
    };

    fetchProducts();
    fetchSubsidiaries();
    fetchStocks();
  }, [corpIdx]);

  // 새로운 행 추가 함수
  const addRow = (index = rows.length) => {
    const newRow = {
      checked: false,
      date: new Date().toISOString().slice(0, 10),
      number: latestStockIdx + 1,
      code: '',
      name: '',
      quantity: '',
      subName: '',
    };
    const newRows = [...rows.slice(0, index + 1), newRow, ...rows.slice(index + 1)];
    setRows(newRows);
    setLatestStockIdx(latestStockIdx + 1);
  };

  // 체크박스 상태 변경 함수
  const handleCheckboxToggle = (index) => {
    const newRows = [...rows];
    newRows[index].checked = !newRows[index].checked;
    setRows(newRows);
  };

  // 입력값 변경 처리 함수
  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // 선택된 행 삭제 함수
  const deleteCheckedRows = () => {
    const newRows = rows.filter((row) => !row.checked);
    setRows(newRows);
  };

  // 전체 선택 체크박스 상태 변경 함수
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newRows = rows.map((row) => ({ ...row, checked: newSelectAll }));
    setSelectAll(newSelectAll);
    setRows(newRows);
  };

  // 데이터 저장 함수
 // 데이터 저장 함수
const handleSave = async () => {
  const checkedRows = rows.filter((row) => row.checked);
  const saveRequests = checkedRows.map((row) => {
    const product = products.find((product) => product.prodBarcode === row.code);
    const subsidiary = subsidiaries.find((sub) => sub.subName === row.subName);
    return {
      corpIdx: corpIdx,
      prodBarcode: row.code,
      prodCnt: parseInt(row.quantity, 10),
      subIdx: subsidiary?.subIdx,
    };
  });
  console.log(saveRequests);
  try {
    await axios.post('http://localhost:8090/tree/api/products/stock', {
      productsList: saveRequests,
      subIdx: saveRequests[0].subIdx,
    });
    alert('저장되었습니다.');
    // 저장 완료 후 새로고침
    window.location.reload();
  } catch (error) {
    console.error('There was an error saving the data!', error);
    alert('저장 중 오류가 발생했습니다.');
  }
};

  // 파일 가져오기 함수
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
          number: latestStockIdx + 1 + index,
          code: data.prodBarcode,
          name: data.prodName,
          quantity: data.stockCnt,
          subName: data.corpName,
        }));
        setRows((prevRows) => [...prevRows, ...importedData]);
        setLatestStockIdx(latestStockIdx + importedData.length);
      } else {
        alert('파일 업로드 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error importing file!', error.response.data);
      alert('파일 업로드 중 오류가 발생했습니다: ' + error.response.data.message);
    }
  };

  // 데이터 내보내기 함수
  const handleExport = async () => {
    const checkedRows = rows.filter((row) => row.checked);
    if (checkedRows.length === 0) {
      alert('내보낼 행을 선택해주세요.');
      return;
    }

    const exportData = checkedRows.map((row) => ({
      'Product Barcode': row.code,
      'Product Name': row.name,
      'Stock Count': row.quantity,
      Subsidiary: row.subName,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  return (
    <div className={`${styles.tableContainer} ${darkMode ? 'dark-mode' : ''}`}>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>입고 등록</h2>
        <div className={styles.buttonContainer}>
          <button className={`${styles.defaultButton} ${styles.deleteButton}`} onClick={deleteCheckedRows}>
            <img src={deleteIcon} alt="삭제 아이콘" />
            삭제
          </button>
          <button className={`${styles.defaultButton} ${styles.saveButton}`} onClick={handleSave}>
            <img src={saveIcon} alt="저장하기 아이콘" />
            저장하기
          </button>
          <input type="file" id="importFile" style={{ display: 'none' }} onChange={handleImport} />
          <button
            className={`${styles.defaultButton} ${styles.importButton}`}
            onClick={() => document.getElementById('importFile').click()}
          >
            <img src={importIcon} alt="가져오기 아이콘" />
            가져오기
          </button>
          <button className={`${styles.defaultButton} ${styles.exportButton}`} onClick={handleExport}>
            <img src={exportIcon} alt="내보내기 아이콘" />
            내보내기
          </button>
          <button className={styles.addRowButton} onClick={() => addRow(rows.length - 1)}>
            +행추가
          </button>
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>
              <input type="checkbox" className={styles.checkbox} checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>입고일</th>
            <th>입고 번호</th>
            <th>제품 코드</th>
            <th>제품명</th>
            <th>입고수량</th>
            <th>입고 업체</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={styles.tbodyRow} onClick={() => handleCheckboxToggle(index)}>
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={row.checked}
                  onChange={() => handleCheckboxToggle(index)}
                />
              </td>
              <td>{row.date}</td>
              <td>{row.number}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <select
                  value={row.code}
                  onChange={(e) => {
                    handleInputChange(index, 'code', e.target.value);
                    const selectedProduct = products.find((product) => product.prodBarcode === e.target.value);
                    handleInputChange(index, 'name', selectedProduct ? selectedProduct.prodName : '');
                  }}
                  className={styles.selectInput}
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
                    handleInputChange(index, 'name', e.target.value);
                    const selectedProduct = products.find((product) => product.prodName === e.target.value);
                    handleInputChange(index, 'code', selectedProduct ? selectedProduct.prodBarcode : '');
                  }}
                  className={styles.selectInput}
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
                  className={styles.inputText}
                  placeholder="입고수량"
                />
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <select
                  value={row.subName}
                  onChange={(e) => handleInputChange(index, 'subName', e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="">입고 업체</option>
                  {subsidiaries
                    .filter((sub) => sub.isRelease === 'N')
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

export default InventoryRegistration;
