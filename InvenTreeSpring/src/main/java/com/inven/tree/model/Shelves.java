package com.inven.tree.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

//선반 테이블
public class Shelves {
	// 선반 식별자 
    private Integer shelfIdx; //pk

    // 창고 식별자 
    private Integer whIdx;	//fk

    // 랙 아이디 
    private String rackId;

    // 선반 아이디 
    private String shelfId;

    // 선반 상태 
    private String shelfStatus;
}
