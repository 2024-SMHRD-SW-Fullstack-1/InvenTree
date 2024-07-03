import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./MembersRegistration.module.css";
import deleteIcon from "../../assets/images/삭제L.png";
import saveIcon from "../../assets/images/저장L.png";
import importIcon from "../../assets/images/가져오기L.png";
import exportIcon from "../../assets/images/업로드L.png";
import * as XLSX from "xlsx";

const MembersRegistration = () => {
    const [rows, setRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData("http://localhost:8090/tree/api/members", setRows);
    }, []);

    const fetchData = async (url, setData) => {
        try {
            setLoading(true);
            console.log(`Fetching data from ${url}`);
            const response = await axios.get(url, { withCredentials: true });
            console.log("Raw fetched data:", response.data);
            setData(response.data.filter((item) => item !== null));
        } catch (error) {
            console.error(`There was an error fetching data from ${url}!`, error);
        } finally {
            setLoading(false);
        }
    };
    const addRow = () => {
        setRows([...rows, createNewRow()]);
    };

    const createNewRow = () => ({
        checked: false,
        corpIdx: "",
        mbId: "",
        mbPw: "",
        mbName: "",
        mbPhone: "",
        authIdx: 0,
        joinedAt: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).replace("T", " "),
    });

    const handleCheckboxToggle = (index) => {
        const newRows = [...rows];
        if (newRows[index]) {
            // null 체크 추가
            newRows[index].checked = !newRows[index].checked;
            setRows(newRows);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const deleteCheckedRows = async () => {
        const checkedRows = rows.filter((row) => row.checked);
        try {
            setLoading(true);
            await axios.post("http://localhost:8090/tree/api/members/delete", checkedRows, { withCredentials: true });
            setRows(rows.filter((row) => !row.checked));
            alert("삭제되었습니다.");
        } catch (error) {
            console.error("There was an error deleting the data!", error);
            alert("삭제 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        const newRows = rows.map((row) => ({ ...row, checked: newSelectAll }));
        setSelectAll(newSelectAll);
        setRows(newRows);
    };

    const handleSave = async () => {
        const checkedRows = rows.filter((row) => row.checked);
        try {
            setLoading(true);
            await axios.post("http://localhost:8090/tree/api/members/save", checkedRows, { withCredentials: true });
            alert("저장되었습니다.");
        } catch (error) {
            console.error("There was an error saving the data!", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8090/tree/api/members/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                alert("파일이 성공적으로 업로드 되었습니다.");
                console.log("Received data:", response.data);
                setRows((prevRows) => [...prevRows, ...response.data]);
            } else {
                alert("파일 업로드 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("Error importing file!", error);
            alert("파일 업로드 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const checkedRows = rows.filter((row) => row.checked);
        if (checkedRows.length === 0) {
            alert("내보낼 행을 선택해주세요.");
            return;
        }

        const exportData = checkedRows.map((row) => ({
            회사코드: row.corpIdx,
            아이디: row.mbId,
            비밀번호: row.mbPw,
            이름: row.mbName,
            전화번호: row.mbPhone,
            권한등급: row.authIdx,
            가입일자: row.joinedAt,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "exported_data.xlsx");
    };

    if (loading) {
        return <div className={style.loading}>Loading...</div>;
    }

    return (
        <div className={style.tableContainer}>
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
                    <button className={style.addRowButton} onClick={addRow}>
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
                        <th>회사코드</th>
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
                            row && ( // null 체크 추가
                                <tr key={index} onClick={() => handleCheckboxToggle(index)} className={style.tbody}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className={style.checkbox}
                                            checked={row.checked || false} // 기본값 추가
                                            onChange={() => handleCheckboxToggle(index)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.corpIdx}
                                            onChange={(e) => handleInputChange(index, "corpIdx", e.target.value)}
                                            className={style.inputText}
                                            placeholder="회사코드"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.mbId}
                                            onChange={(e) => handleInputChange(index, "mbId", e.target.value)}
                                            className={style.inputText}
                                            placeholder="아이디"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.mbPw}
                                            onChange={(e) => handleInputChange(index, "mbPw", e.target.value)}
                                            className={style.inputText}
                                            placeholder="비밀번호"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.mbName}
                                            onChange={(e) => handleInputChange(index, "mbName", e.target.value)}
                                            className={style.inputText}
                                            placeholder="이름"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.mbPhone}
                                            onChange={(e) => handleInputChange(index, "mbPhone", e.target.value)}
                                            className={style.inputText}
                                            placeholder="전화번호"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.joinedAt}
                                            onChange={(e) => handleInputChange(index, "joinedAt", e.target.value)}
                                            className={style.inputText}
                                            placeholder="가입일자 YYYY-MM-DD HH:MM:SS"
                                        />
                                    </td>
                                </tr>
                            )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MembersRegistration;
