package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Stocks {
	@JsonProperty("stockIdx")
	private int stockIdx;

	@JsonProperty("corpIdx")
	private String corpIdx;

	@JsonProperty("prodIdx")
	private int prodIdx;

	@JsonProperty("stockCnt")
	private int stockCnt;

	@JsonProperty("stockedAt")
	private String stockedAt;

	@JsonProperty("subIdx")
	private Integer subIdx;

	// Getters and Setters
	public int getStockIdx() {
		return stockIdx;
	}

	public void setStockIdx(int stockIdx) {
		this.stockIdx = stockIdx;
	}

	public String getCorpIdx() {
		return corpIdx;
	}

	public void setCorpIdx(String corpIdx) {
		this.corpIdx = corpIdx;
	}

	public int getProdIdx() {
		return prodIdx;
	}

	public void setProdIdx(int prodIdx) {
		this.prodIdx = prodIdx;
	}

	public int getStockCnt() {
		return stockCnt;
	}

	public void setStockCnt(int stockCnt) {
		this.stockCnt = stockCnt;
	}

	public String getStockedAt() {
		return stockedAt;
	}

	public void setStockedAt(String stockedAt) {
		this.stockedAt = stockedAt;
	}

	public Integer getSubIdx() {
		return subIdx;
	}

	public void setSubIdx(Integer subIdx) {
		this.subIdx = subIdx;
	}
}
