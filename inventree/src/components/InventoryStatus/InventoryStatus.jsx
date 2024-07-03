import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import style from './InventoryStatus.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { useDarkMode } from '../DarkMode/DarkModeContext';

const InventoryStatus = () => {
  const [rows, setRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [uniqueWarehouses, setUniqueWarehouses] = useState({
    uniqueWh: [],
    uniqueShelves: [],
    uniqueRacks: [],
  });
  const corpIdx = localStorage.getItem('corpIdx');
  const { darkMode } = useDarkMode();

  const fetchData = useCallback(async () => {
    try {
      const productResponse = await axios.get(`http://localhost:8090/tree/api/products/${corpIdx}`);
      setProducts(productResponse.data);

      const warehouseResponse = await axios.get('http://localhost:8090/tree/api/warehouse', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      setWarehouses(warehouseResponse.data);

      const uniqueWh = Array.from(
        new Set(
          warehouseResponse.data
            .filter((wh) => wh.bidlName && wh.whIdx)
            .map((wh) => JSON.stringify({ whIdx: wh.whIdx, bidlName: wh.bidlName })),
        ),
      ).map((e) => JSON.parse(e));

      const uniqueShelves = Array.from(
        new Set(
          warehouseResponse.data
            .filter((shelf) => shelf.shelfId && shelf.shelfIdx)
            .map((shelf) => JSON.stringify({ shelfIdx: shelf.shelfIdx, shelfId: shelf.shelfId, whIdx: shelf.whIdx })),
        ),
      ).map((e) => JSON.parse(e));

      const uniqueRacks = Array.from(
        new Set(
          warehouseResponse.data
            .filter((rack) => rack.rackId)
            .map((rack) => JSON.stringify({ rackId: rack.rackId, whIdx: rack.whIdx })),
        ),
      ).map((e) => JSON.parse(e));

      console.log('Fetched unique racks:', uniqueRacks);

      setUniqueWarehouses({
        uniqueWh,
        uniqueShelves,
        uniqueRacks,
      });

      const initialRows = productResponse.data.map((product) => {
        const warehouse = warehouseResponse.data.find((wh) => wh.whIdx === product.whIdx) || {};
        const shelf = warehouseResponse.data.find((shelf) => shelf.shelfIdx === product.shelfIdx) || {};
        return {
          prodIdx: product.prodIdx,
          checked: false,
          prodBarcode: product.prodBarcode || '',
          prodName: product.prodName || '',
          prodCnt: product.prodCnt || 0,
          whIdx: product.whIdx || '',
          bidlName: warehouse.bidlName || '',
          shelfIdx: product.shelfIdx || '',
          shelfId: shelf.shelfId || '',
          rackId: product.rackId || '',
          prodInfo: product.prodInfo || '',
        };
      });
      setRows(initialRows);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  }, [corpIdx]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

// 행을 선택하거나 선택 해제하는 핸들러 함수
const handleCheckboxToggle = (index) => {
  const newRows = [...rows];
  newRows[index].checked = !newRows[index].checked;
  setRows(newRows);
};

// 입력 필드의 변경을 처리하는 함수
const handleInputChange = (index, field, value) => {
  const newRows = [...rows];
  newRows[index][field] = value;

  if (field === 'shelfId') {
    const selectedShelf = uniqueWarehouses.uniqueShelves.find((shelf) => shelf.shelfId === value);
    if (selectedShelf) {
      const rackId = selectedShelf.shelfId.replace('S', 'R');
      newRows[index]['rackId'] = rackId;
    } else {
      newRows[index]['rackId'] = '';
    }
  } else if (field === 'rackId') {
    const selectedRack = uniqueWarehouses.uniqueRacks.find((rack) => rack.rackId === value);
    if (selectedRack) {
      const shelfId = selectedRack.rackId.replace('R', 'S');
      newRows[index]['shelfId'] = shelfId;
    } else {
      newRows[index]['shelfId'] = '';
    }
  }

  setRows(newRows);
};

// 창고 변경을 처리하는 함수
const handleWarehouseChange = (index, whIdx) => {
  const newRows = [...rows];
  const selectedWarehouse = uniqueWarehouses.uniqueWh.find((wh) => wh.whIdx === whIdx);

  if (selectedWarehouse) {
    const filteredShelves = uniqueWarehouses.uniqueShelves.filter((shelf) => shelf.whIdx === whIdx);
    const filteredRacks = uniqueWarehouses.uniqueRacks.filter((rack) => rack.whIdx === whIdx);

    newRows[index]['whIdx'] = whIdx;
    newRows[index]['bidlName'] = selectedWarehouse.bidlName;
    newRows[index]['shelfId'] = filteredShelves.length > 0 ? filteredShelves[0].shelfId : '';
    newRows[index]['rackId'] = filteredRacks.length > 0 ? filteredRacks[0].rackId : '';
  } else {
    newRows[index]['whIdx'] = '';
    newRows[index]['bidlName'] = '';
    newRows[index]['shelfId'] = '';
    newRows[index]['rackId'] = '';
  }

  setRows(newRows);
};

// 체크된 행을 삭제하는 함수
const deleteCheckedRows = async () => {
  const checkedRows = rows.filter((row) => row.checked);
  const rowsToDelete = checkedRows.filter((row) => row.prodIdx);
  const rowsToRemove = checkedRows.filter((row) => !row.prodIdx);

  try {
    if (rowsToDelete.length > 0) {
      const deleteRequests = rowsToDelete.map((row) =>
        axios.delete(`http://localhost:8090/tree/api/inventoryStatus/product/${row.prodIdx}`),
      );
      await Promise.all(deleteRequests);
    }

    const newRows = rows.filter((row) => !checkedRows.includes(row));
    setRows(newRows);

    if (rowsToDelete.length > 0 || rowsToRemove.length > 0) {
      alert('선택한 행이 삭제되었습니다.');
    } else {
      alert('삭제할 행을 선택해주세요.');
    }
  } catch (error) {
    console.error('There was an error deleting the data!', error);
    alert('삭제 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
  }
};

// 모든 행을 선택하거나 해제하는 함수
const handleSelectAll = () => {
  const newSelectAll = !selectAll;
  const newRows = rows.map((row) => ({ ...row, checked: newSelectAll }));
  setSelectAll(newSelectAll);
  setRows(newRows);
};

// 데이터를 저장하는 함수
const handleSave = async () => {
  const saveRequests = rows
    .filter((row) => row.checked)
    .map((row) => {
      if (!row.prodBarcode || !row.prodName || row.prodCnt === undefined || row.prodCnt === null) {
        throw new Error(`제품 코드, 제품명, 재고수량은 필수 입력 항목입니다.`);
      }

      const selectedWarehouse = uniqueWarehouses.uniqueWh.find((wh) => wh.bidlName === row.bidlName);
      const whIdx = selectedWarehouse ? selectedWarehouse.whIdx : null;

      const selectedShelf = uniqueWarehouses.uniqueShelves.find((shelf) => shelf.shelfId === row.shelfId);
      const shelfIdx = selectedShelf ? selectedShelf.shelfIdx : null;

      return {
        prodIdx: row.prodIdx,
        corpIdx: corpIdx,
        prodBarcode: row.prodBarcode,
        prodName: row.prodName,
        prodCnt: row.prodCnt !== '' ? parseInt(row.prodCnt, 10) : 0,
        whIdx: whIdx,
        shelfIdx: shelfIdx,
        rackId: row.rackId || null,
        prodInfo: row.prodInfo !== undefined ? row.prodInfo : null,
      };
    });

  try {
    if (saveRequests.length === 0) {
      alert('저장할 데이터를 선택해주세요.');
      return;
    }

    const response = await axios.post('http://localhost:8090/tree/api/inventoryStatus/save', saveRequests);
    if (response.status === 200) {
      alert('저장되었습니다.');
      fetchData();
    } else {
      alert('저장 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('There was an error saving the data!', error);
    alert('저장 중 오류가 발생했습니다: ' + error.message);
  }
};

// 파일을 가져오는 함수
const handleImport = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post('http://localhost:8090/tree/api/excel/importWithDetails', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 200) {
      console.log('Received data:', response.data);

      const importedData = response.data.map((data) => {
        const warehouse = uniqueWarehouses.uniqueWh.find((wh) => wh.bidlName === data.corpName);
        const shelf = uniqueWarehouses.uniqueShelves.find((shelf) => shelf.shelfId === data.shelfId);
        const rack = uniqueWarehouses.uniqueRacks.find((rack) => rack.rackId === data.rackId);

        console.log('Mapped shelf:', shelf);
        console.log('Mapped rack:', rack);

        return {
          checked: false,
          prodIdx: null,
          prodBarcode: data.prodBarcode || '',
          prodName: data.prodName || '',
          prodCnt: data.stockCnt || 0,
          whIdx: warehouse ? warehouse.whIdx : '',
          bidlName: data.corpName || '',
          shelfIdx: shelf ? shelf.shelfIdx : '',
          shelfId: data.shelfId || '',
          rackId: data.rackId || '',
          prodInfo: data.prodInfo || '',
        };
      });

      setRows((prevRows) => [...prevRows, ...importedData]);
      alert('파일이 성공적으로 업로드 되었습니다.');
    } else {
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('Error importing file!', error);
    alert('파일 업로드 중 오류가 발생했습니다: ' + error.response?.data?.message);
  }
};

// 데이터를 내보내는 함수
const handleExport = () => {
  const checkedRows = rows.filter((row) => row.checked);
  if (checkedRows.length === 0) {
    alert('내보낼 행을 선택해주세요.');
    return;
  }
  const exportData = checkedRows.map((row) => ({
    '제품 코드': row.prodBarcode,
    제품명: row.prodName,
    재고수량: row.prodCnt,
    '창고 이름': row.bidlName,
    '랙 이름': row.rackId,
    '선반 이름': row.shelfId,
    비고: row.prodInfo,
  }));
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, 'inventory_data.xlsx');
};

// 새로운 행을 추가하는 함수
const handleAddRow = () => {
  const newRow = {
    prodIdx: null,
    checked: false,
    prodBarcode: '',
    prodName: '',
    prodCnt: '',
    whIdx: '',
    bidlName: '',
    shelfIdx: '',
    shelfId: '',
    rackId: '',
    prodInfo: '',
  };
  setRows([...rows, newRow]);
};

  return (
    <div className={`${style.tableContainer} ${darkMode ? 'dark-mode' : ''}`}>
      <div className={style.headerContainer}>
        <h2 className={style.title}>재고 현황</h2>
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
          <button className={style.addRowButton} onClick={handleAddRow}>
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
            <th>제품 코드</th>
            <th>제품명</th>
            <th>재고수량</th>
            <th>창고 이름</th>
            <th>랙 이름</th>
            <th>선반 이름</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.key || index} onClick={() => handleCheckboxToggle(index)} className={style.tbody}>
              <td>
                <input
                  type="checkbox"
                  className={style.checkbox}
                  checked={row.checked}
                  onChange={() => handleCheckboxToggle(index)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.prodBarcode}
                  onChange={(e) => handleInputChange(index, 'prodBarcode', e.target.value)}
                  className={style.inputText}
                  placeholder="제품 코드"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.prodName}
                  onChange={(e) => handleInputChange(index, 'prodName', e.target.value)}
                  className={style.inputText}
                  placeholder="제품명"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.prodCnt}
                  onChange={(e) => handleInputChange(index, 'prodCnt', e.target.value)}
                  className={style.inputText}
                  placeholder="재고수량"
                />
              </td>
              <td>
                <select
                  value={row.whIdx}
                  onChange={(e) => handleWarehouseChange(index, Number(e.target.value))}
                  className={style.select}
                >
                  <option value="">창고 이름</option>
                  {uniqueWarehouses.uniqueWh.map((wh) => (
                    <option key={wh.whIdx} value={wh.whIdx}>
                      {wh.bidlName}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={row.rackId || ''}
                  onChange={(e) => handleInputChange(index, 'rackId', e.target.value)}
                  className={style.select}
                >
                  <option value="">랙 이름</option>
                  {uniqueWarehouses.uniqueRacks
                    .filter((rack) => rack.whIdx === row.whIdx)
                    .map((rack) => (
                      <option key={rack.rackId} value={rack.rackId}>
                        {rack.rackId}
                      </option>
                    ))}
                </select>
              </td>
              <td>
                <select
                  value={row.shelfId || ''}
                  onChange={(e) => handleInputChange(index, 'shelfId', e.target.value)}
                  className={style.select}
                >
                  <option value="">선반 이름</option>
                  {uniqueWarehouses.uniqueShelves
                    .filter((shelf) => shelf.whIdx === row.whIdx)
                    .map((shelf) => (
                      <option key={shelf.shelfIdx} value={shelf.shelfId}>
                        {shelf.shelfId}
                      </option>
                    ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={row.prodInfo}
                  onChange={(e) => handleInputChange(index, 'prodInfo', e.target.value)}
                  className={style.inputText}
                  placeholder="비고"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryStatus;
