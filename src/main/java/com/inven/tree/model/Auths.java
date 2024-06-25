package com.inven.tree.model;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor

//권한 테이블
public class Auths {
	// 권한 식별자 
    private Integer authIdx; //pk

    // 회원 아이디 
    private String mbId;	//fk

    // 재고 권한 
    private String inventoryYn;
    
    // 입출고 권한 
    private String shipYn;

    // 통계 권한 
    private String chartYn;
    
    // 설정권한
    private String setYn;
}