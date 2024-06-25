package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

//출고 테이블
public class Releases {
    // 출고 식별자 
    @JsonProperty("releaseIdx")
    private int releaseIdx;

    // 회사 식별자 
    @JsonProperty("corpIdx")
    private String corpIdx;

    // 제품 식별자 
    @JsonProperty("prodIdx")
    private int prodIdx;

    // 출고 수량 
    @JsonProperty("releaseCnt")
    private int releaseCnt;

    // 출고 일자 
    @JsonProperty("releasedAt")
    private String releasedAt;
    
    // 출고 업체코드
    @JsonProperty("subIdx")
    private Integer subIdx;

	public Integer getSubIdx() {
		return subIdx;
	}

	public void setSubIdx(Integer subIdx) {
		this.subIdx = subIdx;
	}

	public int getReleaseIdx() {
		return releaseIdx;
	}

	public void setReleaseIdx(int releaseIdx) {
		this.releaseIdx = releaseIdx;
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

	public int getReleaseCnt() {
		return releaseCnt;
	}

	public void setReleaseCnt(int releaseCnt) {
		this.releaseCnt = releaseCnt;
	}

	public String getReleasedAt() {
		return releasedAt;
	}

	public void setReleasedAt(String releasedAt) {
		this.releasedAt = releasedAt;
	}

	

    
}
