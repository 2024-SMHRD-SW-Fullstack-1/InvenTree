package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryStatus {

	@JsonProperty("prodBarcode")
	private String prodBarcode;
	@JsonProperty("prodName")
	private String prodName;
	@JsonProperty("prodCnt")
	private int prodCnt;
	@JsonProperty("bidlName")
	private String bidlName;
	@JsonProperty("shelfId")
	private String shelfId;
	@JsonProperty("rackId")
	private String rackId;
	@JsonProperty("prodInfo")
	private String prodInfo;
	@JsonProperty("corpIdx")
	private String corpIdx;

}
