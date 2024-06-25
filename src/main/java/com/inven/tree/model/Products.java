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
}
