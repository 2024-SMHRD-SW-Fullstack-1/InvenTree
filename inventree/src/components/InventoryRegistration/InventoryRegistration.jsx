import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./InventoryRegistration.module.css";
import deleteIcon from "../../assets/images/삭제L.png";
import saveIcon from "../../assets/images/저장L.png";
import importIcon from "../../assets/images/가져오기L.png";
import exportIcon from "../../assets/images/업로드L.png";
import * as XLSX from "xlsx";
import { Autocomplete, TextField } from "@mui/material";

const InventoryRegistration = () => {
    const [rows, setRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [latestStockIdx, setLatestStockIdx] = useState(0);
    const [products, setProducts] = useState([]);
    const [subsidiaries, setSubsidiaries] = useState([]);
    const corpIdx = localStorage.getItem("corpIdx"); // 현재 로그인한 corpIdx 가져오기

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/products/${corpIdx}`);
                setProducts(response.data);
            } catch (error) {
                console.error("There was an error fetching the products!", error);
            }
        };

        const fetchSubsidiaries = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/tree/api/subsidiaries/incoming/${corpIdx}`);
                setSubsidiaries(response.data);
            } catch (error) {
                console.error("There was an error fetching the subsidiaries!", error);
            }
        };

        const fetchStocks = async () => {
            try {
                const response = await axios.get("http://localhost:8090/tree/api/stocks");
                const stocks = response.data;
                if (stocks.length > 0) {
                    const maxStockIdx = Math.max(...stocks.map((stock) => stock.stockIdx));
                    setLatestStockIdx(maxStockIdx);
                }
            } catch (error) {
                console.error("There was an error fetching the stocks!", error);
            }
        };

        fetchProducts();
        fetchSubsidiaries();
        fetchStocks();
    }, [corpIdx]);

    const addRow = (index = rows.length) => {
        const newRow = {
            checked: false,
            date: new Date().toISOString().slice(0, 10),
            number: latestStockIdx + 1,
            code: "",
            name: "",
            quantity: "",
            subName: "", // 필드명 변경
        };
        const newRows = [...rows.slice(0, index + 1), newRow, ...rows.slice(index + 1)];
        setRows(newRows);
        setLatestStockIdx(latestStockIdx + 1);
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

    const deleteCheckedRows = () => {
        const newRows = rows.filter((row) => !row.checked);
        setRows(newRows);
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        const newRows = rows.map((row) => ({ ...row, checked: newSelectAll }));
        setSelectAll(newSelectAll);
        setRows(newRows);
    };

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
        console.log(saveRequests); // 전송되는 데이터를 출력하여 확인
        try {
            await axios.post("http://localhost:8090/tree/api/stockProducts", {
                productsList: saveRequests,
                subIdx: saveRequests[0].subIdx, // 모든 제품이 동일한 subIdx를 가진다고 가정
            });
            alert("저장되었습니다.");
        } catch (error) {
            console.error("There was an error saving the data!", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8090/tree/api/excel/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("파일이 성공적으로 업로드 되었습니다.");
                console.log("Received data:", response.data); // 받은 데이터 로그

                // 받은 데이터를 상태에 저장하고 새로운 행으로 추가
                const importedData = response.data.map((data, index) => ({
                    checked: false,
                    date: new Date().toISOString().slice(0, 10),
                    number: latestStockIdx + 1 + index, // 입고 번호 증가
                    code: data.prodBarcode,
                    name: data.prodName,
                    quantity: data.stockCnt,
                    subName: data.corpName, // 필드명 변경
                }));
                setRows((prevRows) => [...prevRows, ...importedData]);
                setLatestStockIdx(latestStockIdx + importedData.length); // 최신 입고 번호 업데이트
            } else {
                alert("파일 업로드 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("Error importing file!", error.response.data);
            alert("파일 업로드 중 오류가 발생했습니다: " + error.response.data.message);
        }
    };

    const handleExport = async () => {
        const checkedRows = rows.filter((row) => row.checked);
        if (checkedRows.length === 0) {
            alert("내보낼 행을 선택해주세요.");
            return;
        }

        const exportData = checkedRows.map((row) => ({
            "Product Barcode": row.code,
            "Product Name": row.name,
            "Stock Count": row.quantity,
            Subsidiary: row.subName, // 필드명 변경
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "exported_data.xlsx");
    };

    return (
        <div className={style.tableContainer}>
            <div className={style.headerContainer}>
                <h2 className={style.title}>입고 등록</h2>
                <div className={style.buttonContainer}>
                    <button className={`${style.defaultButton} ${style.deleteButton}`} onClick={deleteCheckedRows}>
                        <img src={deleteIcon} alt="삭제 아이콘" />
                        삭제
                    </button>
                    <button className={`${style.defaultButton} ${style.saveButton}`} onClick={handleSave}>
                        <img src={saveIcon} alt="저장하기 아이콘" />
                        저장하기
                    </button>
                    <input type="file" id="importFile" style={{ display: "none" }} onChange={handleImport} />
                    <button
                        className={`${style.defaultButton} ${style.importButton}`}
                        onClick={() => document.getElementById("importFile").click()}
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
                            <input
                                type="checkbox"
                                className={style.checkbox}
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
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
                            <td>{row.date}</td>
                            <td>{row.number}</td>
                            <td>
                                <Autocomplete
                                    value={products.find((product) => product.prodBarcode === row.code) || null}
                                    onChange={(event, newValue) => {
                                        handleInputChange(index, "code", newValue ? newValue.prodBarcode : "");
                                        handleInputChange(index, "name", newValue ? newValue.prodName : "");
                                    }}
                                    options={products}
                                    getOptionLabel={(option) => option.prodBarcode}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </td>
                            <td>
                                <Autocomplete
                                    value={products.find((product) => product.prodName === row.name) || null}
                                    onChange={(event, newValue) => {
                                        handleInputChange(index, "name", newValue ? newValue.prodName : "");
                                        handleInputChange(index, "code", newValue ? newValue.prodBarcode : "");
                                    }}
                                    options={products}
                                    getOptionLabel={(option) => option.prodName}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.quantity}
                                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                                    className={style.inputText}
                                />
                            </td>
                            <td>
                                <Autocomplete
                                    value={
                                        subsidiaries.find(
                                            (sub) => sub.subName === row.subName && sub.isRelease === "N"
                                        ) || null
                                    }
                                    onChange={(event, newValue) => {
                                        handleInputChange(index, "subName", newValue ? newValue.subName : "");
                                    }}
                                    options={subsidiaries.filter((sub) => sub.isRelease === "N")}
                                    getOptionLabel={(option) => option.subName}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryRegistration;