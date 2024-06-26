package com.inven.tree;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inven.tree.mapper.SubsidiariesMapper;
import com.inven.tree.model.Subsidiaries;


@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SubsidiaryController {
	 @Autowired
	    private SubsidiariesMapper subsidiaryMapper;
	 @GetMapping("/subsidiary")
	    @ResponseBody
	    public List<Subsidiaries> getSubsidiary() {
	        return subsidiaryMapper.selectAllSubsidiary();
	    }
}