import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import style from "./CorporatesRegistration.module.css";
import searchIcon from "../../assets/images/검색L.png";
import filterIcon from "../../assets/images/필터L.png";
import deleteIcon from "../../assets/images/삭제L.png";
import saveIcon from "../../assets/images/저장L.png";
import importIcon from "../../assets/images/가져오기L.png";
import exportIcon from "../../assets/images/업로드L.png";
import * as XLSX from "xlsx";
import { corpIdxContext } from "../Context/corpIdxContext";

const CorporatesRegistration = () => {
    const [corporates, setCorporates] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const { CorpIdx } = useContext(corpIdxContext);

    // console.log(corporates);

    useEffect(() => {
        const fetchData = async () => {
            if (!CorpIdx) return;

            try {
                const response = await axios.get(`http://localhost:8090/tree/api/corporates`, {
                    params: { corpIdx: CorpIdx },
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                });

                setCorporates(response.data);
            } catch (error) {
                console.error("Error fetching corporates data:", error);
            }
        };

        fetchData();
    }, [CorpIdx]);
    // console.log(corporates[0].corpName);
    // 창고 추가
    const addCorporates = () => {
        const newCorporate = {
            checked: false,
            corpName: "",
            corpOwner: "",
            corpTel: "",
            isNew: true,
        };

        setCorporates([...corporates, newCorporate]);
    };

    // 업데이트 함수
    const saveCorporates = async () => {
        try {
            const savePromises = corporates.map((corporate) => {
                if (corporate.isNew) {
                    return axios.post("http://localhost:8090/tree/api/corporates/insert", {
                        ...corporate,
                        corpIdx: CorpIdx,
                    });
                } else {
                    return axios.put(`http://localhost:8090/tree/api/corporates/update`, {
                        ...corporate,
                        corpIdx: CorpIdx,
                    });
                }
            });

            await Promise.all(savePromises);
            alert("저장되었습니다.");
            // 저장 후 데이터를 다시 불러옵니다.
            const response = await axios.get(`http://localhost:8090/tree/api/corporates`, {
                params: { corpIdx: CorpIdx },
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });

            const fetchedCorporates = response.data.map((corporate) => ({
                ...corporate,
                isNew: false,
            }));

            setCorporates(fetchedCorporates);
        } catch (error) {
            console.error("Error saving corporates data:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    // 입력 필드 변경 처리
    const handleInputChange = (corporatesIndex, field, value) => {
        setCorporates((prevCorporates) =>
            prevCorporates.map((corporate, index) =>
                index === corporatesIndex ? { ...corporate, [field]: value } : corporate
            )
        );
    };

    // 개별 체크박스 토글
    const handleCheckboxToggle = (index) => {
        const updatedCorporates = [...corporates];
        updatedCorporates[index].checked = !updatedCorporates[index].checked;
        setCorporates(updatedCorporates);
    };

    // 전체 선택 토글
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        const updatedCorporates = corporates.map((corporate) => ({ ...corporate, checked: newSelectAll }));
        setSelectAll(newSelectAll);
        setCorporates(updatedCorporates);
    };

    // 파일 가져오기 (import)
    const importSelected = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx, .xls, .pdf";

        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const importedData = XLSX.utils.sheet_to_json(worksheet);

                    const newCorporates = importedData.map((item, index) => ({
                        checked: false,
                        corpName: item["업체명"] || "",
                        corpOwner: item["대표자"] || "",
                        corpTel: item["대표전화번호"] || "",
                        whIdx: corporates.length + index,
                    }));

                    setCorporates((prevCorporates) => [...prevCorporates, ...newCorporates]);
                    alert("파일이 성공적으로 가져와졌습니다.");
                } catch (error) {
                    console.error("Error processing file:", error);
                    alert("파일 처리 중 오류가 발생했습니다.");
                }
            };

            reader.readAsArrayBuffer(file);
        };

        input.click();
    };

    // 선택된 데이터 내보내기 (export)
    const exportSelected = async () => {
        const checkedCorporates = corporates.filter((corporate) => corporate.checked);
        if (checkedCorporates.length === 0) {
            alert("내보낼 행을 선택해주세요.");
            return;
        }

        const exportData = checkedCorporates.map((corporate) => ({
            업체명: corporate.corpName,
            대표자: corporate.corpOwner,
            대표전화번호: corporate.corpTel,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "exported_data.xlsx");
        console.log("Exporting data to Excel or PDF");
    };

    return (
        <div className={style.tableContainer}>
            <div className="tableContainer">
                <div className={style.headerContainer}>
                    <h2>업체등록</h2>
                    <div className={style.searchFilterContainer}>
                        <div className={style.searchInputContainer}>
                            <img src={searchIcon} alt="조회 아이콘" className={style.icon} />
                            <input type="text" className={style.searchInput} placeholder="조회" />
                        </div>
                        <button className={style.filterButton}>
                            <img src={filterIcon} alt="필터 아이콘" className={style.icon} />
                            필터
                        </button>
                    </div>
                    <div className={style.buttonContainer}>
                        <button className={style.defaultButton}>
                            <img src={deleteIcon} align="top" alt="삭제 아이콘" />
                            삭제
                        </button>
                        <button onClick={saveCorporates} className={style.defaultButton}>
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
                        <button className={style.addRowButton} onClick={addCorporates}>
                            + 창고
                        </button>
                    </div>
                </div>

                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                            </th>
                            <th>No</th>
                            <th>업체명</th>
                            <th>대표자</th>
                            <th>대표 전화번호</th>
                        </tr>
                    </thead>
                    <tbody>
                        {corporates.map((corporate, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={corporate.checked || false}
                                        onChange={() => handleCheckboxToggle(index)}
                                    />
                                </td>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={corporate.corpName}
                                        onChange={(e) => handleInputChange(index, "corpName", e.target.value)}
                                        className={style.tableInput}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={corporate.corpOwner}
                                        onChange={(e) => handleInputChange(index, "corpOwner", e.target.value)}
                                        className={style.tableInput}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={corporate.corpTel}
                                        onChange={(e) => handleInputChange(index, "corpTel", e.target.value)}
                                        className={style.tableInput}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CorporatesRegistration;
