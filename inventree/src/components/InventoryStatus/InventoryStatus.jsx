import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './InventoryStatus.module.css';
import deleteIcon from '../../assets/images/삭제L.png';
import saveIcon from '../../assets/images/저장L.png';
import importIcon from '../../assets/images/가져오기L.png';
import exportIcon from '../../assets/images/업로드L.png';
import * as XLSX from 'xlsx';
import { Autocomplete, TextField } from '@mui/material';
const InventoryStatus = () => {
  const [rows, setRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [uniqueWarehouses, setUniqueWarehouses] = useState({ uniqueWh: [], uniqueShelves: [], uniqueRacks: [] });
  const corpIdx = localStorage.getItem('corpIdx'); // 현재 로그인한 corpIdx 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:8090/tree/api/products/${corpIdx}`);
        setProducts(productResponse.data);
        const warehouseResponse = await axios.get('http://localhost:8090/tree/api/warehouse', {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        // 중복 제거 및 null 값 제거 로직
        const uniqueWh = Array.from(
          new Set(
            warehouseResponse.data
              .filter((wh) => wh.bidlName) // bidlName이 null이 아닌 경우만
              .map((wh) => JSON.stringify({ whIdx: wh.whIdx, bidlName: wh.bidlName })),
          ),
        ).map((e) => JSON.parse(e));
        const uniqueShelves = Array.from(
          new Set(
            warehouseResponse.data
              .filter((shelf) => shelf.shelfId) // shelfId가 null이 아닌 경우만
              .map((shelf) => JSON.stringify({ shelfIdx: shelf.shelfIdx, shelfId: shelf.shelfId })),
          ),
        ).map((e) => JSON.parse(e));
        const uniqueRacks = Array.from(
          new Set(
            warehouseResponse.data
              .filter((rack) => rack.rackId) // rackId가 null이 아닌 경우만
              .map((rack) => JSON.stringify({ rackId: rack.rackId })),
          ),
        ).map((e) => JSON.parse(e));
        setWarehouses(warehouseResponse.data);
        setUniqueWarehouses({
          uniqueWh,
          uniqueShelves,
          uniqueRacks,
        });
        // 초기 데이터 로드
        const initialRows = productResponse.data.map((product, index) => {
          const warehouse = warehouseResponse.data.find((wh) => wh.whIdx === product.whIdx) || {};
          const shelf = warehouseResponse.data.find((shelf) => shelf.shelfIdx === product.shelfIdx) || {};
          return {
            rowIdx: index,
            prodIdx: product.prodIdx, // 추가된 prodIdx
            checked: false,
            prodBarcode: product.prodBarcode,
            prodName: product.prodName,
            prodCnt: product.prodCnt,
            whIdx: product.whIdx,
            bidlName: warehouse.bidlName || '',
            shelfIdx: product.shelfIdx,
            shelfId: shelf.shelfId || '',
            rackId: product.rackId || '',
            prodInfo: product.prodInfo || '',
          };
        });
        setRows(initialRows);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };
    fetchData();
  }, [corpIdx]);
  const handleCheckboxToggle = (index) => {
    const newRows = [...rows];
    newRows[index].checked = !newRows[index].checked;
    setRows(newRows);
  };
  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };
  const deleteCheckedRows = async () => {
    const checkedRows = rows.filter((row) => row.checked);
    const deleteRequests = checkedRows.map((row) =>
      axios.delete(`http://localhost:8090/tree/api/inventoryStatus/product/${row.prodIdx}`),
    );

    try {
      await Promise.all(deleteRequests);
      const newRows = rows.filter((row) => !row.checked);
      setRows(newRows);
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('There was an error deleting the data!', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newRows = rows.map((row) => ({ ...row, checked: newSelectAll }));
    setSelectAll(newSelectAll);
    setRows(newRows);
  };
  const handleSave = async () => {
    const saveRequests = rows
      .filter((row) => row.checked)
      .map((row) => {
        const warehouse = warehouses.find((wh) => wh.whIdx === row.whIdx && wh.corpIdx === corpIdx);
        const shelf = uniqueWarehouses.uniqueShelves.find((shelf) => shelf.shelfIdx === row.shelfIdx);
        return {
          prodIdx: row.prodIdx, // 추가된 prodIdx
          rowIdx: row.rowIdx,
          corpIdx: corpIdx,
          prodBarcode: row.prodBarcode,
          prodName: row.prodName,
          prodCnt: parseInt(row.prodCnt, 10),
          whIdx: warehouse ? warehouse.whIdx : null,
          shelfIdx: shelf ? shelf.shelfIdx : null,
          rackId: row.rackId,
          prodInfo: row.prodInfo,
        };
      });
    try {
      await axios.post('http://localhost:8090/tree/api/inventoryStatus/save', saveRequests);
      alert('저장되었습니다.');
    } catch (error) {
      console.error('There was an error saving the data!', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };
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
        alert('파일이 성공적으로 업로드 되었습니다.');
        console.log('Received data:', response.data);
        const importedData = response.data.map((data, index) => ({
          checked: false,
          prodBarcode: data.prodBarcode,
          prodName: data.prodName,
          prodCnt: data.stockCnt,
          whIdx: '', // 창고 인덱스
          bidlName: data.corpName || '', // 창고 이름
          shelfIdx: '', // 선반 인덱스
          shelfId: data.shelfId || '', // 선반 이름
          rackId: data.rackId || '', // 랙 이름
          prodInfo: data.prodInfo || '', // 비고
          key: `${data.prodBarcode}-${index}`, // 고유한 키 생성
        }));
        setRows((prevRows) => [...prevRows, ...importedData]);
      } else {
        alert('파일 업로드 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error importing file!', error);
      alert('파일 업로드 중 오류가 발생했습니다: ' + error.response.data.message);
    }
  };

  const handleExport = async () => {
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
      '선반 이름': row.shelfId,
      '랙 이름': row.rackId,
      비고: row.prodInfo,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'inventory_data.xlsx');
  };
  const handleAddRow = () => {
    const newRow = {
      rowIdx: rows.length,
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
    <div className={style.tableContainer}>
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
            <th>선반 이름</th>
            <th>랙 이름</th>
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
                <TextField
                  value={row.prodBarcode}
                  onChange={(e) => handleInputChange(index, 'prodBarcode', e.target.value)}
                  className={style.inputText}
                  placeholder="제품 코드"
                />
              </td>
              <td>
                <TextField
                  value={row.prodName}
                  onChange={(e) => handleInputChange(index, 'prodName', e.target.value)}
                  className={style.inputText}
                  placeholder="제품명"
                />
              </td>
              <td>
                <TextField
                  value={row.prodCnt}
                  onChange={(e) => handleInputChange(index, 'prodCnt', e.target.value)}
                  className={style.inputText}
                  placeholder="재고수량"
                />
              </td>
              <td>
                <Autocomplete
                  value={uniqueWarehouses.uniqueWh.find((wh) => wh.bidlName === row.bidlName) || null}
                  onChange={(event, newValue) => {
                    handleInputChange(index, 'whIdx', newValue ? newValue.whIdx : '');
                    handleInputChange(index, 'bidlName', newValue ? newValue.bidlName : '');
                  }}
                  options={uniqueWarehouses.uniqueWh}
                  getOptionLabel={(option) => (option ? option.bidlName : '창고 이름')}
                  renderInput={(params) => <TextField {...params} placeholder="창고 이름" />}
                  isOptionEqualToValue={(option, value) => option.bidlName === value.bidlName}
                  key={`${row.bidlName}-${index}`}
                />
              </td>
              <td>
                <Autocomplete
                  value={uniqueWarehouses.uniqueShelves.find((shelf) => shelf.shelfId === row.shelfId) || null}
                  onChange={(event, newValue) => {
                    handleInputChange(index, 'shelfIdx', newValue ? newValue.shelfIdx : '');
                    handleInputChange(index, 'shelfId', newValue ? newValue.shelfId : '');
                  }}
                  options={uniqueWarehouses.uniqueShelves}
                  getOptionLabel={(option) => (option ? option.shelfId : '선반 이름')}
                  renderInput={(params) => <TextField {...params} placeholder="선반 이름" />}
                  isOptionEqualToValue={(option, value) => option.shelfId === value.shelfId}
                  key={`${row.shelfId}-${index}`}
                />
              </td>
              <td>
                <Autocomplete
                  value={uniqueWarehouses.uniqueRacks.find((rack) => rack.rackId === row.rackId) || null}
                  onChange={(event, newValue) => {
                    handleInputChange(index, 'rackId', newValue ? newValue.rackId : '');
                  }}
                  options={uniqueWarehouses.uniqueRacks}
                  getOptionLabel={(option) => (option ? option.rackId : '랙 이름')}
                  renderInput={(params) => <TextField {...params} placeholder="랙 이름" />}
                  isOptionEqualToValue={(option, value) => option.rackId === value.rackId}
                  key={`${row.rackId}-${index}`}
                />
              </td>
              <td>
                <TextField
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
