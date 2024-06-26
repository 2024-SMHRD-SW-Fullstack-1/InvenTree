import React, { useState } from "react";
import style from "./WarehouseLayout.module.css";

const WarehouseLayout = () => {
    const [racks, setRacks] = useState([
        {
            id: 1,
            shelves: [
                { id: "A", value: 16 },
                { id: "B", value: 15 },
                { id: "C", value: 13 },
                { id: "D", value: 16 },
            ],
        },
        // 다른 랙 데이터 추가 가능
    ]);

    const addRack = () => {
        setRacks([...racks, { id: racks.length + 1, shelves: [] }]);
    };

    const removeRack = (rackId) => {
        setRacks(racks.filter((rack) => rack.id !== rackId));
    };

    const addShelf = (rackId) => {
        setRacks(
            racks.map((rack) => {
                if (rack.id === rackId) {
                    const newShelfId = String.fromCharCode(65 + rack.shelves.length);
                    return {
                        ...rack,
                        shelves: [...rack.shelves, { id: newShelfId, value: 0 }],
                    };
                }
                return rack;
            })
        );
    };

    const removeShelf = (rackId, shelfId) => {
        setRacks(
            racks.map((rack) => {
                if (rack.id === rackId) {
                    return {
                        ...rack,
                        shelves: rack.shelves.filter((shelf) => shelf.id !== shelfId),
                    };
                }
                return rack;
            })
        );
    };

    return (
        <div className={style.warehouseLayout}>
            <div className={style.warehouseControls}>
                <button onClick={addRack}>랙 추가</button>
            </div>
            <div className={style.racks}>
                {racks.map((rack) => (
                    <div key={rack.id} className={style.rack}>
                        <div className={style.rackHeader}>
                            <span>선반 {String.fromCharCode(64 + rack.id)}</span>
                            <button onClick={() => removeRack(rack.id)}>랙 삭제</button>
                        </div>
                        <div className={style.shelves}>
                            {rack.shelves.map((shelf) => (
                                <div key={shelf.id} className={style.shelf}>
                                    <span>{shelf.id}</span>
                                    <span>{shelf.value}</span>
                                    <button
                                        className={style.removeShelf}
                                        onClick={() => removeShelf(rack.id, shelf.id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className={style.rackControls}>
                            <button onClick={() => addShelf(rack.id)}>선반 추가</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseLayout;
