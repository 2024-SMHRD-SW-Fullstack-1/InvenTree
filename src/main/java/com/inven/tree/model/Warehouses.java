package com.inven.tree.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

//창고

public class Warehouses {
	// 창고 식별자 
    private Integer whIdx; //pk

    // 회사 식별자 
    private String corpIdx; //fk

    // 건물 이름 
    private String bidlName;

    // 담당자 아이디 
    private String mbId;	//fk

    // 창고 주소 
    private String whAddr;

    // 창고 상태
    private String whStatus;
}
