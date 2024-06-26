package com.inven.tree;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.ProductsMapper;
import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.mapper.WarehousesMapper;
import com.inven.tree.model.InventoryStatus;
import com.inven.tree.model.Products;
import com.inven.tree.model.Shelves;
import com.inven.tree.model.Warehouses;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/inventoryStatus")
public class InventoryStatusController {
	@Autowired
	private ProductsMapper productsMapper;

	@Autowired
	private WarehousesMapper warehousesMapper;

	@Autowired
	private ShelvesMapper shelvesMapper;

	@GetMapping("/{corpIdx}")
	public ResponseEntity<List<InventoryStatus>> getInventoryStatus(@PathVariable String corpIdx) {
		try {
			List<Products> products = productsMapper.selectProductsByCorpIdx(corpIdx);
			List<Warehouses> warehouses = warehousesMapper.selectAllWarehouses(corpIdx);
			List<Shelves> shelves = shelvesMapper.selectAllShelves();

			List<InventoryStatus> inventoryStatusList = products.stream().filter(product -> product != null) // null 제외
					.map(product -> {
						InventoryStatus status = new InventoryStatus();
						status.setProdBarcode(product.getProdBarcode());
						status.setProdName(product.getProdName());
						status.setProdCnt(product.getProdCnt());
						status.setProdInfo(product.getProdInfo());

						Warehouses warehouse = warehouses.stream().filter(w -> w.getWhIdx().equals(product.getWhIdx()))
								.findFirst().orElse(null);
						Shelves shelf = shelves.stream().filter(s -> s.getShelfIdx().equals(product.getShelfIdx()))
								.findFirst().orElse(null);

						if (warehouse != null) {
							status.setBidlName(warehouse.getBidlName());
						}
						if (shelf != null) {
							status.setShelfId(shelf.getShelfId());
							status.setRackId(shelf.getRackId());
						}
						return status;
					}).collect(Collectors.toList());

			return ResponseEntity.ok(inventoryStatusList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@PostMapping("/save")
	public ResponseEntity<String> saveInventoryStatus(@RequestBody List<InventoryStatus> inventoryStatusList) {
		for (InventoryStatus status : inventoryStatusList) {
			Warehouses warehouse = warehousesMapper.selectWarehouseByBidlName(status.getBidlName());
			Shelves shelf = shelvesMapper.selectShelfByShelfId(status.getShelfId());

			Products product = new Products();
			product.setProdBarcode(status.getProdBarcode());
			product.setProdName(status.getProdName());
			product.setProdCnt(status.getProdCnt());
			product.setProdInfo(status.getProdInfo());

			if (warehouse != null) {
				product.setWhIdx(warehouse.getWhIdx());
			}
			if (shelf != null) {
				product.setShelfIdx(shelf.getShelfIdx());
			}

			if (productsMapper.existsByProdBarcode(product.getProdBarcode())) {
				productsMapper.updateProduct(product);
			} else {
				productsMapper.insertProduct(product);
			}
		}
		return ResponseEntity.ok("재고 정보가 성공적으로 저장되었습니다.");
	}

	@PostMapping("/delete")
	public ResponseEntity<String> deleteInventoryStatus(@RequestBody List<String> prodBarcodes) {
		for (String prodBarcode : prodBarcodes) {
			productsMapper.deleteProductByBarcode(prodBarcode);
		}
		return ResponseEntity.ok("선택된 재고 정보가 삭제되었습니다.");
	}
}
