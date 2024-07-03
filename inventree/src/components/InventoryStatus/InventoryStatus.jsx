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
    const [shelves, setShelves] = useState([]);
    const corpIdx = localStorage.getItem('corpIdx'); // 현재 로그인한 corpIdx 가져오기

    useEffect(() => {
        const fetchInventoryStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/inventoryStatus/${corpIdx}`);
                setRows(response.data);
            } catch (error) {
                console.error('There was an error fetching the inventory status!', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/products/${corpIdx}`);
                setProducts(response.data);
            } catch (error) {
                console.error('There was an error fetching the products!', error);
            }
        };

        const fetchWarehouses = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/warehouses/${corpIdx}`);
                setWarehouses(response.data);
            } catch (error) {
                console.error('There was an error fetching the warehouses!', error);
            }
        };

        const fetchShelves = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/shelves/${corpIdx}`);
                setShelves(response.data);
            } catch (error) {
                console.error('There was an error fetching the shelves!', error);
            }
        };

        fetchInventoryStatus();
        fetchProducts();
        fetchWarehouses();
        fetchShelves();
    }, [corpIdx]);

    const addRow = () => {
        setRows([...rows, {
            checked: false,
            prodBarcode: '',
            prodName: '',
            prodCnt: 0,
            bidlName: '',
            shelfId: '',
            rackId: '',
            prodInfo: ''
        }]);
    };

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
        const idsToDelete = rows.filter(row => row.checked).map(row => row.prodBarcode);
        await axios.post('http://localhost:8090/tree/api/inventoryStatus/delete', idsToDelete);
        const newRows = rows.filter(row => !row.checked);
        setRows(newRows);
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        const newRows = rows.map(row => ({ ...row, checked: newSelectAll }));
        setSelectAll(newSelectAll);
        setRows(newRows);
    };

    const handleSave = async () => {
        const checkedRows = rows.filter(row => row.checked);
        try {
            await axios.post('http://localhost:8090/tree/api/inventoryStatus/save', checkedRows);
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
            const response = await axios.post('http://localhost:8090/tree/api/inventoryStatus/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('파일이 성공적으로 업로드 되었습니다.');
                const importedData = response.data.map((data, index) => ({
                    ...data,
                    checked: false
                }));
                setRows((prevRows) => [...prevRows, ...importedData]);
            } else {
                alert('파일 업로드 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error importing file!', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const handleExport = async () => {
        const checkedRows = rows.filter(row => row.checked);
        if (checkedRows.length === 0) {
            alert('내보낼 행을 선택해주세요.');
            return;
        }

        const exportData = checkedRows.map(row => ({
            'Product Barcode': row.prodBarcode,
            'Product Name': row.prodName,
            'Stock Count': row.prodCnt,
            'Warehouse Name': row.bidlName,
            'Shelf Name': row.shelfId,
            'Rack Name': row.rackId,
            'Info': row.prodInfo
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, 'exported_data.xlsx');
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
                    <input
                        type="file"
                        id="importFile"
                        style={{ display: 'none' }}
                        onChange={handleImport}
                    />
                    <button className={`${style.defaultButton} ${style.importButton}`} onClick={() => document.getElementById('importFile').click()}>
                        <img src={importIcon} alt="가져오기 아이콘" />
                        가져오기
                    </button>
                    <button className={`${style.defaultButton} ${style.exportButton}`} onClick={handleExport}>
                        <img src={exportIcon} alt="내보내기 아이콘" />
                        내보내기
                    </button>
                    <button className={style.addRowButton} onClick={addRow}>+행추가</button>
                </div>
            </div>

            <table className={style.table}>
                <thead className={style.thead}>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                className={style.checkbox}
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th>제품코드</th>
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
                        <tr key={index} onClick={() => handleCheckboxToggle(index)} className={style.tbody}>
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
                                />
                            </td>
                            <td>
                                <TextField
                                    value={row.prodName}
                                    onChange={(e) => handleInputChange(index, 'prodName', e.target.value)}
                                />
                            </td>
                            <td>
                                <TextField
                                    type="number"
                                    value={row.prodCnt}
                                    onChange={(e) => handleInputChange(index, 'prodCnt', e.target.value)}
                                />
                            </td>
                            <td>
                                <Autocomplete
                                    value={warehouses.find((warehouse) => warehouse.bidlName === row.bidlName) || null}
                                    onChange={(event, newValue) => {
                                        handleInputChange(index, 'bidlName', newValue ? newValue.bidlName : '');
                                    }}
                                    options={warehouses}
                                    getOptionLabel={(option) => option.bidlName}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </td>
                            <td>
                                <Autocomplete
                                    value={shelves.find((shelf) => shelf.shelfId === row.shelfId) || null}
                                    onChange={(event, newValue) => {
                                        handleInputChange(index, 'shelfId', newValue ? newValue.shelfId : '');
                                    }}
                                    options={shelves}
                                    getOptionLabel={(option) => option.shelfId}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </td>
                            <td>
                                <Autocomplete
                                    value={shelves.find((shelf) => shelf.rackId === row.rackId) || null}
                                    onChange={(event, newValue) => {
                                        handleInputChange(index, 'rackId', newValue ? newValue.rackId : '');
                                    }}
                                    options={shelves}
                                    getOptionLabel={(option) => option.rackId}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </td>
                            <td>
                                <TextField
                                    value={row.prodInfo}
                                    onChange={(e) => handleInputChange(index, 'prodInfo', e.target.value)}
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
