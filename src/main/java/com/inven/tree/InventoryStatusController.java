package com.inven.tree;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inven.tree.mapper.InventoryStatusMapper;
import com.inven.tree.model.InventoryStatus;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/inventoryStatus")
public class InventoryStatusController {

	  @Autowired
	    private InventoryStatusMapper inventoryStatusMapper;

	    @GetMapping("/{corpIdx}")
	    @ResponseBody
	    public List<InventoryStatus> getInventoryStatus(@PathVariable String corpIdx) {
	        return inventoryStatusMapper.findByCorpIdx(corpIdx);
	    }

	    @PostMapping("/save")
	    @ResponseBody
	    public void saveInventoryStatus(@RequestBody List<InventoryStatus> inventoryStatusList) {
	        for (InventoryStatus inventoryStatus : inventoryStatusList) {
	            if (inventoryStatusMapper.existsByProdBarcode(inventoryStatus.getProdBarcode())) {
	                inventoryStatusMapper.update(inventoryStatus);
	            } else {
	                inventoryStatusMapper.insert(inventoryStatus);
	            }
	        }
	    }

	    @PostMapping("/delete")
	    @ResponseBody
	    public void deleteInventoryStatus(@RequestBody List<String> prodBarcodes) {
	        for (String prodBarcode : prodBarcodes) {
	            inventoryStatusMapper.delete(prodBarcode);
	        }
	    }
	}