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

	@JsonProperty("corpIdx")
    private String corpIdx;
	
	@JsonProperty("corpName")
    private String corpName;

    @JsonProperty("corpOwner")
    private String corpOwner;

    @JsonProperty("corpTel")
    private String corpTel;



    

	

}