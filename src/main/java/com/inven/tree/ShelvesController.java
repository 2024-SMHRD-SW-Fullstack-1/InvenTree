package com.inven.tree;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inven.tree.mapper.ShelvesMapper;
import com.inven.tree.model.Shelves;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/shelves")
public class ShelvesController {
	 @Autowired
	    private ShelvesMapper shelvesMapper;

	    @GetMapping("/{corpIdx}")
	    @ResponseBody
	    public List<Shelves> getShelves(@PathVariable String corpIdx) {
	        return shelvesMapper.findByCorpIdx(corpIdx);
	    }
}
