package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
//회사 
public class Corporates {
	
	//회사 식별자
	@JsonProperty("corpIdx")
    private String corpIdx;
	
	//회사명
	@JsonProperty("corpName")
    private String corpName;

	//회사대표자
    @JsonProperty("corpOwner")
    private String corpOwner;

    //회사전화번호
    @JsonProperty("corpTel")
    private String corpTel;



    

	

}