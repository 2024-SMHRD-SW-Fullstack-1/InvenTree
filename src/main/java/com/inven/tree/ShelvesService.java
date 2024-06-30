package com.inven.tree;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.model.Shelves;

@Service
public class ShelvesService {

    @Autowired
    private ShelvesMapper shelvesMapper;

    public List<Shelves> getShelvesByWarehouseId(int whIdx) {
        return shelvesMapper.findByWarehouseId(whIdx);
    }

    public Shelves addShelf(int whIdx) {
        Shelves newShelf = new Shelves();
        newShelf.setWhIdx(whIdx);
        // 필요한 기본 값을 설정
        newShelf.setRackId("Default Rack");
        newShelf.setShelfId("Default Shelf");
        newShelf.setShelfStatus("N");  // 변경된 부분
        shelvesMapper.insert(newShelf);
        return newShelf;
    }

    public void deleteShelf(int shelfId) {
        shelvesMapper.delete(shelfId);
    }
}
