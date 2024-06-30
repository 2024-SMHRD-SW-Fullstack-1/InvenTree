package com.inven.tree;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.model.Shelves;
import com.inven.tree.ShelvesService;

@Controller
@CrossOrigin(origins = {"http://localhost:3000", "http://inventree.shop"}, allowCredentials = "true")
@RequestMapping("api/shelves")
public class ShelvesController {

    @Autowired
    private ShelvesMapper shelvesMapper;

    @Autowired
    private ShelvesService shelvesService;

    @GetMapping("/{corpIdx}")
    @ResponseBody
    public List<Shelves> getShelvesByCorpIdx(@PathVariable String corpIdx) {
        return shelvesMapper.findByCorpIdx(corpIdx);
    }

    @GetMapping
    public ResponseEntity<List<Shelves>> getShelvesByWarehouseId(@RequestParam("wh_idx") int whIdx) {
        List<Shelves> shelves = shelvesService.getShelvesByWarehouseId(whIdx);
        return ResponseEntity.ok(shelves);
    }

    @PostMapping
    public ResponseEntity<Shelves> addShelf(@RequestBody Map<String, Integer> request) {
        int whIdx = request.get("wh_idx");
        Shelves newShelf = shelvesService.addShelf(whIdx);
        return ResponseEntity.ok(newShelf);
    }

    @DeleteMapping("/{shelfId}")
    public ResponseEntity<Void> deleteShelf(@PathVariable("shelfId") int shelfId) {
        shelvesService.deleteShelf(shelfId);
        return ResponseEntity.noContent().build();
    }
}
