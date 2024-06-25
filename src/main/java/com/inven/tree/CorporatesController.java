package com.inven.tree;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
=======
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
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
<<<<<<< HEAD
    public List<Corporates> getCorporates() { //회사 리스트
        return corpMapper.selectAllCorporates();
=======
    public List<Corporates> getCorporates(@RequestParam("corpIdx") String corpIdx) { //회사 리스트
        return corpMapper.selectAllCorporates(corpIdx);
    }
    
    @PutMapping("/corporates/update")
    public ResponseEntity<String> updateCorporates(@RequestBody Corporates corporates){
        try {
            corpMapper.updateCorporates(corporates);
            return ResponseEntity.ok("Corporates updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update corporates.");
        }
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
    }
}
