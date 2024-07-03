import React, { useState, useEffect } from 'react';
import style from './WarehouseLayout.module.css';
import axios from 'axios';
import { useDarkMode } from '../DarkMode/DarkModeContext';

const WarehouseLayout = ({ isReadOnly, shelvesPerPage = 7, className }) => {
  // 상태 훅 선언
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [shelves, setShelves] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedRack, setSelectedRack] = useState(null);

  // 다크 모드 상태 가져오기
  const { darkMode } = useDarkMode();

  // 컴포넌트 마운트 시 창고 목록 가져오기
  useEffect(() => {
    fetchWarehouses();
  }, []);

  // 창고 선택 시 선반 목록 및 회사별 상품 목록 가져오기
  useEffect(() => {
    if (selectedWarehouse) {
      fetchShelves(selectedWarehouse);
      fetchProductsByCompany(selectedWarehouse);
    }
  }, [selectedWarehouse, currentPage]);

  // 창고 목록 가져오는 함수
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:8090/tree/api/warehouse/list', {
        withCredentials: true,
      });
      setWarehouses(response.data || []);
    } catch (error) {
      console.error('창고 정보를 가져오는 데 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };

  // 선반 목록 가져오는 함수
  const fetchShelves = async (whIdx) => {
    try {
      const response = await axios.get(`http://localhost:8090/tree/api/shelves?wh_idx=${whIdx}`, {
        withCredentials: true,
      });
      const shelvesData = response.data || [];

      // 각 선반에 있는 상품 데이터를 추가로 가져오기
      for (let shelf of shelvesData) {
        const productsResponse = await axios.get(
          `http://localhost:8090/tree/api/shelves/shelf-products?shelfIdx=${shelf.shelfIdx}`,
          {
            withCredentials: true,
          },
        );
        shelf.products = productsResponse.data || [];
      }

      setShelves(shelvesData);
      setSelectedWarehouse(whIdx);
    } catch (error) {
      console.error('선반 정보를 가져오는 데 실패했습니다:', error.response ? error.response.data : error.message);
      setShelves([]);
    }
  };

  // 회사별 상품 목록 가져오는 함수
  const fetchProductsByCompany = async (corpIdx) => {
    try {
      const response = await axios.get(`http://localhost:8090/tree/api/products/by-company?corpIdx=${corpIdx}`, {
        withCredentials: true,
      });
      setProducts(response.data);
    } catch (error) {
      console.error('상품 정보를 가져오는 데 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };

  // 선반 추가 함수
  const addShelf = async () => {
    if (!selectedWarehouse) return;
    const newShelfId = String.fromCharCode(65 + shelves.length); // 선반 ID 생성
    const newShelf = {
      whIdx: selectedWarehouse,
      shelfId: `선반 ${newShelfId}`,
      rackId: 'A',
      shelfStatus: 'N',
    };
    try {
      const response = await axios.post('http://localhost:8090/tree/api/shelves', newShelf, {
        withCredentials: true,
      });
      setShelves([...shelves, response.data]); // 선반 목록 업데이트
    } catch (error) {
      console.error('선반 추가에 실패했습니다:', error);
    }
  };

  // 선반 삭제 함수
  const removeShelf = async (shelfIdx) => {
    try {
      await axios.delete(`http://localhost:8090/tree/api/shelves/${shelfIdx}`, {
        withCredentials: true,
      });
      setShelves(shelves.filter((shelf) => shelf.shelfIdx !== shelfIdx)); // 선반 목록에서 삭제
    } catch (error) {
      console.error('선반 삭제에 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };

  // 랙 추가 함수
  const addRack = async (shelfIdx) => {
    const shelf = shelves.find((s) => s.shelfIdx === shelfIdx);
    const currentRacks = shelf.rackId ? shelf.rackId.split(',') : [];

    if (currentRacks.length >= 4) {
      return; // 랙이 4개 이상이면 추가 불가
    }

    const newRackId = String.fromCharCode(65 + currentRacks.length); // 랙 ID 생성

    try {
      const response = await axios.post(
        `http://localhost:8090/tree/api/shelves/${shelfIdx}/racks`,
        { id: newRackId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setShelves(shelves.map((s) => (s.shelfIdx === shelfIdx ? response.data : s))); // 선반 목록 업데이트
    } catch (error) {
      console.error('랙 추가에 실패했습니다:', error);
      if (error.response) {
        console.error('응답 데이터:', error.response.data);
        console.error('상태 코드:', error.response.status);
      } else if (error.request) {
        console.error('요청이 전송되었지만 응답을 받지 못했습니다.');
      } else {
        console.error('에러 메시지:', error.message);
      }
    }
  };

  // 랙 삭제 함수
  const removeRack = async (shelfIdx) => {
    const shelf = shelves.find((s) => s.shelfIdx === shelfIdx);
    if (!shelf || !shelf.rackId) return;

    const currentRacks = shelf.rackId.split(',');
    if (currentRacks.length === 0) return;

    const updatedRacks = currentRacks.slice(0, -1);
    const updatedRackId = updatedRacks.join(',');

    try {
      const response = await axios.put(
        `http://localhost:8090/tree/api/shelves/${shelfIdx}`,
        { ...shelf, rackId: updatedRackId },
        { withCredentials: true },
      );
      setShelves(shelves.map((s) => (s.shelfIdx === shelfIdx ? response.data : s))); // 선반 목록 업데이트
    } catch (error) {
      console.error('랙 삭제에 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };

  // 랙에 상품 추가 함수
  const addProductToRack = async (shelfIdx, rackId, product) => {
    try {
      const response = await axios.post(
        `http://localhost:8090/tree/api/shelves/${shelfIdx}/racks/${rackId}/product`,
        product,
        { withCredentials: true },
      );

      // 랙에 새 상품이 추가된 후 선반 상태 업데이트
      setShelves((prevShelves) =>
        prevShelves.map((shelf) => {
          if (shelf.shelfIdx === shelfIdx) {
            const updatedShelf = { ...shelf };
            const rackIndex = updatedShelf.rackId.split(',').indexOf(rackId);
            if (rackIndex !== -1) {
              if (!updatedShelf.products) {
                updatedShelf.products = [];
              }
              updatedShelf.products[rackIndex] = product;
            }
            return updatedShelf;
          }
          return shelf;
        }),
      );
      setSelectedRack(null);
    } catch (error) {
      console.error('상품 추가에 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };

  // 페이지 계산을 위한 변수들
  const indexOfLastShelf = currentPage * shelvesPerPage;
  const indexOfFirstShelf = indexOfLastShelf - shelvesPerPage;
  const currentShelves = shelves.slice(indexOfFirstShelf, indexOfLastShelf);
  const totalPages = Math.ceil(shelves.length / shelvesPerPage);

  // 다음 페이지로 이동하는 함수
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // 이전 페이지로 이동하는 함수
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
        <div className={`${style.warehouseLayout} ${darkMode ? style.darkMode : ''} ${className}`}>
      <div className={style.controls}>
        <div className={style.leftControls}>
          <span>창고 목록</span>
          <select
            onChange={(e) => {
              setCurrentPage(1);
              const selectedWhIdx = e.target.value;
              const selectedWarehouse = warehouses.find((w) => w.whIdx.toString() === selectedWhIdx);
              setSelectedWarehouse(selectedWhIdx);
              if (selectedWarehouse) {
                fetchProductsByCompany(selectedWarehouse.corpIdx);
              }
            }}
          >
            <option value="">창고를 선택하세요</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.whIdx} value={warehouse.whIdx}>
                {warehouse.bidlName}
              </option>
            ))}
          </select>
          {!isReadOnly && <button onClick={addShelf}>선반 추가</button>}
        </div>
        <div className={style.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            &lt;
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      </div>
      <div className={style.shelvesContainer}>
        {currentShelves.map((shelf) => (
          <div key={shelf.shelfIdx} className={style.shelf}>
            <div className={style.shelfHeader}>
              <span>{shelf.shelfId}</span>
              {!isReadOnly && (
                <button onClick={() => removeShelf(shelf.shelfIdx)} className={style.removeShelfButton}>
                  선반 삭제
                </button>
              )}
            </div>
            <div className={style.rack}>
              {shelf.rackId &&
                shelf.rackId.split(',').map((rackId, index) => (
                  <div
                    key={`${shelf.shelfIdx}-${rackId}`}
                    className={style.rack}
                    onClick={() =>
                      !isReadOnly &&
                      (!shelf.products || !shelf.products[index]) &&
                      setSelectedRack({ shelfIdx: shelf.shelfIdx, rackId })
                    }
                  >
                    <span className={style.rackId}>{rackId}</span>
                    {shelf.products && shelf.products[index] ? (
                      <div>
                        <span className={style.productName}>{shelf.products[index].prodName}</span>
                        <span className={style.productCount}>{shelf.products[index].prodCnt}</span>
                      </div>
                    ) : (
                      <span className={style.emptyRack}>비어 있음</span>
                    )}
                  </div>
                ))}
            </div>
            {!isReadOnly && (
              <div className={style.rackControls}>
                <button onClick={() => addRack(shelf.shelfIdx)}>랙 추가</button>
                <button onClick={() => removeRack(shelf.shelfIdx)}>랙 삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedRack && !isReadOnly && (
        <div className={style.productModal}>
          <h3>상품 선택</h3>
          <select
            onChange={(e) => addProductToRack(selectedRack.shelfIdx, selectedRack.rackId, JSON.parse(e.target.value))}
          >
            <option value="">상품을 선택하세요</option>
            {products.map((product) => (
              <option key={product.prodIdx} value={JSON.stringify(product)}>
                {product.prodName} ({product.prodCnt}개 남음)
              </option>
            ))}
          </select>
          <button onClick={() => setSelectedRack(null)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default WarehouseLayout;