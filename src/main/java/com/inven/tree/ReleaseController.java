package com.inven.tree;

import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.model.Releases;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ReleaseController {
	 @Autowired
	    private ReleasesMapper releasesMapper;
	    private static final Logger logger = LoggerFactory.getLogger(ReleaseController.class);

	    @GetMapping("/releases")
	    public ResponseEntity<List<Releases>> selectAllReleases() {
	        try {
	            List<Releases> releases = releasesMapper.selectAllReleases();
	            return ResponseEntity.ok(releases);
	        } catch (Exception e) {
	            logger.error("Error retrieving releases", e);
	            return ResponseEntity.status(500).body(null);
	        }
	    }
	}