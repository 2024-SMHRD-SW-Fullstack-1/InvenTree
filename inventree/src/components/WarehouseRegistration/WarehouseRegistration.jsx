import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./WarehouseRegistration.module.css";
import searchIcon from "../../assets/images/검색L.png";
import filterIcon from "../../assets/images/필터L.png";
import deleteIcon from "../../assets/images/삭제L.png";
import saveIcon from "../../assets/images/저장L.png";
import importIcon from "../../assets/images/가져오기L.png";
import exportIcon from "../../assets/images/업로드L.png";
import * as XLSX from "xlsx";

const WarehouseRegistration = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8090/tree/api/warehouse", {
                    withCredentials: true,

                    headers: { "Content-Type": "application/json" },
                });
                setWarehouses(response.data);
            } catch (error) {
                console.error("권한 데이터를 불러오는 중 오류 발생:", error);
            }
        };
        // console.log(warehouses.data);
        fetchData();
    }, []);

    // 창고 행 추가
    const addWarehouse = () => {
        const newWarehouse = {
            checked: false,
            bidlName: "",
            mbId: "",
            whAddr: "",
            whStatus: "",
            rackId: "",
            shelfId: "",
        };

        setWarehouses([...warehouses, newWarehouse]);
    };
    // 입력 필드 변경 처리
    const handleInputChange = (warehouseIndex, field, value) => {
        setWarehouses((prevWarehouses) =>
            prevWarehouses.map((warehouse, index) =>
                index === warehouseIndex ? { ...warehouse, [field]: value } : warehouse
            )
        );
    };
    // console.log(warehouses.data);

    // 선택된 창고 및 선반 삭제
    const deleteSelectedData = async () => {
        const checkedWarehouses = warehouses.filter((warehouse) => warehouse.checked);
        if (checkedWarehouses.length === 0) {
            alert("삭제할 데이터를 선택해주세요.");
            return;
        }

        const loginWhIdx = checkedWarehouses.map((warehouse) => warehouse.whIdx);
        const loginShelfIdx = checkedWarehouses.map((warehouse) => warehouse.shelfIdx);

        const requestData = {
            loginWhIdx,
            loginShelfIdx,
        };

        window.confirm("진짜 삭제할거라면 확인을 눌러주세요~");
        try {
            const response = await axios.delete("http://localhost:8090/tree/api/warehouse/delete", {
                data: requestData,
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
                validateStatus: function (status) {
                    return (status >= 200 && status < 300) || status === 400; // 정상 상태 코드 또는 400 상태 코드를 처리
                },
            });

            if (response.status === 400) {
                console.log("선반 남아있음");
                alert("선반에 상품이 있습니다.");
            } else {
                console.log("Warehouse and shelf data deleted:", response.data);
                // alert('선택된 데이터가 성공적으로 삭제되었습니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // 정상 작동으로 간주되는 경우
                console.log("선반에 상품이 있어서 창고는 삭제되지 않습니다.");
                alert("선반들에 상품이 있어서 창고는 삭제되지 않습니다.");
            } else {
                // 실제 오류인 경우만 콘솔에 출력
                console.error("Error deleting data:", error);
                alert("데이터 삭제 중 오류가 발생했습니다.");
            }
        }
        window.location.replace("/WarehouseRegistration");
    };

    // 창고 정보 추가 함수
    const insertWarehouses = async () => {
        const newWarehouses = warehouses.filter((warehouse) => warehouse.checked && !warehouse.whIdx);

        if (newWarehouses.length === 0) {
            alert("추가할 새 창고 데이터를 선택해주세요.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8090/tree/api/warehouses/insert", newWarehouses, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Insert response:", response.data);

            // 성공적으로 삽입된 후 필요한 후속 작업을 여기에 추가
            alert("새 창고 데이터가 성공적으로 추가되었습니다.");
        } catch (error) {
            console.error("Error inserting data:", error);
            alert("데이터 삽입 중 오류가 발생했습니다.");
        }
    };

    // 선반 정보 추가 함수
    const insertShelves = async () => {
        // shelfIdx가 없고 checkbox가 체크된 데이터 필터링
        const shelvesToInsert = warehouses.filter((warehouse) => warehouse.checked && !warehouse.shelfIdx);

        if (shelvesToInsert.length === 0) {
            alert("추가할 유효한 데이터를 선택해주세요.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8090/tree/api/shelves/insert", shelvesToInsert, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Insert shelves response:", response.data);
            alert("선반 정보 추가 성공");
            // 추가적인 후속 작업을 여기에 추가할 수 있습니다.
        } catch (error) {
            console.error("Error inserting shelves:", error);
            alert("선반 정보 추가 중 오류가 발생했습니다.");
        }
    };

    //창고 업데이트 함수
    const updateWarehouses = async () => {
        const uniqueWarehouses = [];
        const seenWhIdx = new Set();

        warehouses.forEach((warehouse) => {
            if (warehouse.checked && !seenWhIdx.has(warehouse.whIdx)) {
                seenWhIdx.add(warehouse.whIdx);
                uniqueWarehouses.push(warehouse);
            }
        });

        console.log("확인용 : ", JSON.stringify(uniqueWarehouses));
        if (uniqueWarehouses.length === 0) {
            alert("업데이트할 창고 데이터를 선택해주세요.");
            return;
        }

        try {
            const warehouseResponse = await axios.put(
                "http://localhost:8090/tree/api/warehouse/update",
                uniqueWarehouses,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Warehouse update response:", warehouseResponse.data);

            window.location.replace("/WarehouseRegistration");
            alert("창고 데이터가 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("Error updating warehouses:", error);
            alert("창고 데이터 업데이트 중 오류가 발생했습니다.");
        }
    };

    //선반 업데이트 함수
    const updateShelves = async () => {
        const changedShelves = [];

        warehouses.forEach((warehouse) => {
            if (warehouse.checked) {
                changedShelves.push({
                    shelfId: warehouse.shelfId,
                    shelfIdx: warehouse.shelfIdx,
                    rackId: warehouse.rackId,
                    whIdx: warehouse.whIdx,
                });
            }
        });

        if (changedShelves.length === 0) {
            // alert("변경된 선반 데이터가 없습니다.");
            return;
        }

        try {
            const shelfResponse = await axios.put("http://localhost:8090/tree/api/shelf/update", changedShelves, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Shelf update response:", shelfResponse.data);
            // alert("선반 데이터가 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("Error updating shelves:", error);
            // alert("선반 데이터 업데이트 중 오류가 발생했습니다.");
        }
    };

    // 저장 버튼 변경 추가 동시 진행
    const handleSave = async () => {
        await insertWarehouses();
        await insertShelves();
        await updateWarehouses();
        await updateShelves();
    };

    // 창고, 선반 업데이트 함수
    // const saveSelectedData = async () => {
    //   // 중복된 wh_idx를 제거한 warehouses 배열
    //   const uniqueWarehouses = [];
    //   const seenWhIdx = new Set();

    //   // 변경된 shelves 데이터
    //   const changedShelves = [];

    //   warehouses.forEach((warehouse) => {
    //     if (warehouse.checked && !seenWhIdx.has(warehouse.whIdx)) {
    //       seenWhIdx.add(warehouse.whIdx);
    //       uniqueWarehouses.push(warehouse);
    //     }
    //     // 쉘프 데이터 중 변경된 데이터만 추출
    //     if (warehouse.checked) {
    //       // 예시에서는 변경 여부를 나타내는 shelfChanged 필드를 가정합니다.
    //       changedShelves.push({
    //         shelfId: warehouse.shelfId,
    //         shelfIdx: warehouse.shelfIdx,
    //         rackId: warehouse.rackId,
    //         whIdx: warehouse.whIdx, // wh_idx 추가
    //       });
    //     }
    //   });
    //   console.log("확인용 : ", JSON.stringify(uniqueWarehouses));
    //   if (uniqueWarehouses.length === 0) {
    //     alert("업데이트할 데이터를 선택해주세요.");
    //     return;
    //   }

    //   console.log("출력 확인" + changedShelves); // 미출력

    //   try {
    //     const warehouseResponse = await axios.put(
    //       "http://localhost:8090/tree/api/warehouse/update",
    //       uniqueWarehouses,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );

    //     console.log("Warehouse update response:", warehouseResponse.data);

    //     if (changedShelves.length > 0) {
    //       const shelfResponse = await axios.put(
    //         "http://localhost:8090/tree/api/shelf/update",
    //         changedShelves,
    //         {
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //         }
    //       );

    //       console.log("Shelf update response:", shelfResponse.data);
    //     }

    //     window.location.replace("/WarehouseRegistration");
    //     alert("데이터가 성공적으로 업데이트되었습니다.");
    //   } catch (error) {
    //     console.error("Error updating data:", error);

    //     alert("데이터 업데이트 중 오류가 발생했습니다.");
    //   }
    // };

    // 창고 관리자 변경 함수
    const handleMbIdChange = (whIdx, newMbId) => {
        const updatedWarehouses = warehouses.map((wh) => (wh.whIdx === whIdx ? { ...wh, mbId: newMbId } : wh));
        setWarehouses(updatedWarehouses);
    };

    // 개별 체크박스 토글
    const handleCheckboxToggle = (index) => {
        const updatedWarehouses = [...warehouses];
        updatedWarehouses[index].checked = !updatedWarehouses[index].checked;
        setWarehouses(updatedWarehouses);
    };

    // 전체 선택 토글
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        const updatedWarehouses = warehouses.map((warehouse) => ({
            ...warehouse,
            checked: newSelectAll,
        }));
        setSelectAll(newSelectAll);
        setWarehouses(updatedWarehouses);
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

                    const newWarehouses = importedData.map((item, index) => ({
                        checked: false,
                        bidlName: item["건물명"] || "",
                        rackId: item["랙이름"] || "",
                        shelfId: item["선반이름"] || "",
                        mbId: item["담당자"] || "",
                        whAddr: item["창고주소"] || "",
                        whStatus: item["창고상태"] || "",
                        whIdx: warehouses.length + index,
                    }));

                    setWarehouses((prevWarehouses) => [...prevWarehouses, ...newWarehouses]);
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
        const checkedWarehouses = warehouses.filter((warehouse) => warehouse.checked);
        if (checkedWarehouses.length === 0) {
            alert("내보낼 행을 선택해주세요.");
            return;
        }

        const exportData = checkedWarehouses.map((warehouse) => ({
            건물명: warehouse.bidlName,
            랙이름: warehouse.rackId,
            선반이름: warehouse.shelfId,
            담당자: warehouse.mbId,
            창고주소: warehouse.whAddr,
            창고상태: warehouse.whStatus,
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
                    <h2>창고등록</h2>
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
                        <button onClick={deleteSelectedData} className={style.defaultButton}>
                            <img src={deleteIcon} align="top" alt="삭제 아이콘" />
                            삭제
                        </button>
                        <button onClick={handleSave} className={style.defaultButton}>
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
                        <button className={style.addRowButton} onClick={addWarehouse}>
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
                            <th>건물명</th>
                            <th>랙이름</th>
                            <th>선반이름</th>
                            <th>담당자</th>
                            <th>창고주소</th>
                            <th>창고상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map((warehouse, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={warehouse.checked || false}
                                        onChange={() => handleCheckboxToggle(index)}
                                    />
                                </td>
                                <td>{index + 1}</td>

                                <td>
                                    <input
                                        type="text"
                                        value={warehouse.bidlName || ""}
                                        onChange={(e) => handleInputChange(index, "bidlName", e.target.value)}
                                        className={style.tableInput}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={warehouse.rackId || ""}
                                        onChange={(e) => handleInputChange(index, "rackId", e.target.value)}
                                        className={style.tableInput}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={warehouse.shelfId || ""}
                                        onChange={(e) => handleInputChange(index, "shelfId", e.target.value)}
                                        className={style.tableInput}
                                    />
                                </td>

                                <td>
                                    <select
                                        value={warehouse.mbId || ""}
                                        onChange={(e) => {
                                            const newMbId = e.target.value;
                                            if (
                                                window.confirm(
                                                    `${warehouse.bidlName}의 관리자를 ${newMbId}로 변경하시겠습니까?`
                                                )
                                            ) {
                                                handleMbIdChange(warehouse.whIdx, newMbId);
                                            }
                                        }}
                                        className={style.tableInput}
                                    >
                                        <option value="">선택</option>
                                        {[...new Set(warehouses.map((wh) => wh.mbId))].map((mbId, idx) => (
                                            <option key={idx} value={mbId}>
                                                {mbId}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={warehouse.whAddr}
                                        onChange={(e) => handleInputChange(index, "whAddr", e.target.value)}
                                        className={style.tableInput}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={warehouse.whStatus}
                                        onChange={(e) => handleInputChange(index, "whStatus", e.target.value)}
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

export default WarehouseRegistration;
