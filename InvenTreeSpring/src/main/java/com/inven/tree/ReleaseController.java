package com.inven.tree;

import com.inven.tree.mapper.ReleasesMapper;
import com.inven.tree.model.Releases;
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
	    private ReleasesMapper releasesMapper; // ReleasesMapper를 주입받아 사용

	    // 모든 출고 기록을 조회하는 GET 엔드포인트
	    @GetMapping("/releases")
	    public ResponseEntity<List<Releases>> selectAllReleases() {
	        try {
	            List<Releases> releases = releasesMapper.selectAllReleases(); // 출고 기록 조회
	            return ResponseEntity.ok(releases); // 출고 기록 반환
	        } catch (Exception e) {
	            return ResponseEntity.status(500).body(null); // 500 상태 코드 반환
	        }
	    }
	}