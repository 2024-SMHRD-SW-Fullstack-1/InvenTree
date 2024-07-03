import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const InoutHistoryTable = () => {
    const [entries, setEntries] = useState([]);

    const fetchEntries = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8090/tree/api/stockEntries", {
                params: { corpIdx: localStorage.getItem("corpIdx") },
                withCredentials: true,
            });
            setEntries(response.data.entries || []);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    console.log("InoutHistoryTable - entries:", entries);

    return (
        <table>
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>구분</th>
                    <th>제품 코드</th>
                    <th>제품명</th>
                    <th>수량</th>
                    <th>업체명</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.date}</td>
                        <td>{entry.type}</td>
                        <td>{entry.productCode}</td>
                        <td>{entry.productName}</td>
                        <td>{entry.quantity}</td>
                        <td>{entry.company}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InoutHistoryTable;
