package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Timestamp;

public class Releases {
    @JsonProperty("releaseIdx")
    private int releaseIdx;

    @JsonProperty("corpIdx")
    private String corpIdx;

    @JsonProperty("prodIdx")
    private int prodIdx;

    @JsonProperty("releaseCnt")
    private int releaseCnt;

    @JsonProperty("releasedAt")
    private Timestamp releasedAt;

    @JsonProperty("subIdx") // 추가된 필드
    private int subIdx;

    // Getters and Setters
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

    public Timestamp getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(Timestamp releasedAt) {
        this.releasedAt = releasedAt;
    }

    public int getSubIdx() { // 추가된 getter
        return subIdx;
    }

    public void setSubIdx(int subIdx) { // 추가된 setter
        this.subIdx = subIdx;
    }
}
