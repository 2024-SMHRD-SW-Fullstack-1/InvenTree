package com.inven.tree;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inven.tree.mapper.CorporatesMapper;
import com.inven.tree.model.Corporates;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CorporatesController {
    @Autowired
    private CorporatesMapper corpMapper;

    @GetMapping("/corporates")
    public List<Corporates> getCorporates() { //회사 리스트
        return corpMapper.selectAllCorporates();
    }
}
