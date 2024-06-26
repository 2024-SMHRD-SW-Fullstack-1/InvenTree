package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subsidiaries {
	@JsonProperty("subIdx")
    private Integer subIdx;
	
	@JsonProperty("corpIdx")
	private String corpIdx;
	
	@JsonProperty("subName")
	private String subName;
	
	@JsonProperty("subOwner")
	private String subOwner;
	
	@JsonProperty("subTel")
	private String subTel;
	
	@JsonProperty("subAddr")
	private String subAddr;
	
	@JsonProperty("isRelease")
	private String isRelease;
	
	
	
}
