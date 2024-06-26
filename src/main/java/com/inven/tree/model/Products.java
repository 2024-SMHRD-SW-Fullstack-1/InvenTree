package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Timestamp;

public class Products {

	@JsonProperty("prodIdx")
	private int prodIdx;

	@JsonProperty("prodName")
	private String prodName;

	@JsonProperty("prodInfo")
	private String prodInfo;

	@JsonProperty("prodBarcode")
	private String prodBarcode;

	@JsonProperty("prodCnt")
	private int prodCnt;

	@JsonProperty("prodMake")
	private String prodMake;

	@JsonProperty("createdAt")
	private Timestamp createdAt;

	@JsonProperty("corpIdx")
	private String corpIdx;
	
	//필드 3개 새로 추가 했음(재고 현황 때문에)
	@JsonProperty("shelfIdx")
	private Integer shelfIdx;
	
	@JsonProperty("rackId")
	private String rackId;

	@JsonProperty("whIdx")
	private Integer whIdx;
	
	// Getters and Setters
	public int getProdIdx() {
		return prodIdx;
	}

	public void setProdIdx(int prodIdx) {
		this.prodIdx = prodIdx;
	}

	public String getProdName() {
		return prodName;
	}

	public void setProdName(String prodName) {
		this.prodName = prodName;
	}

	public String getProdInfo() {
		return prodInfo;
	}

	public void setProdInfo(String prodInfo) {
		this.prodInfo = prodInfo;
	}

	public String getProdBarcode() {
		return prodBarcode;
	}

	public void setProdBarcode(String prodBarcode) {
		this.prodBarcode = prodBarcode;
	}

	public int getProdCnt() {
		return prodCnt;
	}

	public void setProdCnt(int prodCnt) {
		this.prodCnt = prodCnt;
	}

	public String getProdMake() {
		return prodMake;
	}

	public void setProdMake(String prodMake) {
		this.prodMake = prodMake;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public String getCorpIdx() {
		return corpIdx;
	}

	public void setCorpIdx(String corpIdx) {
		this.corpIdx = corpIdx;
	}
	
	//재고현황 때문에 3개 새로 추가했음
	public Integer getShelfIdx() {
		return shelfIdx;
	}

	public void setShelfIdx(Integer shelfIdx) {
		this.shelfIdx = shelfIdx;
	}

	public String getRackId() {
		return rackId;
	}

	public void setRackId(String rackId) {
		this.rackId = rackId;
	}

	public Integer getWhIdx() {
		return whIdx;
	}

	public void setWhIdx(Integer whIdx) {
		this.whIdx = whIdx;
	}

}
