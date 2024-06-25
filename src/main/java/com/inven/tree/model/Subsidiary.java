package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Subsidiary {
    @JsonProperty("subIdx")
    private Integer subIdx;     // 계열사 고유키

    @JsonProperty("corpIdx")
    private String corpIdx;     // 회사 고유키 참조

    @JsonProperty("subName")
    private String subName;     // 계열사 명

    @JsonProperty("subOwner")
    private String subOwner;    // 계열사 대표자명

    @JsonProperty("subTel")
    private String subTel;      // 계열사 전화번호

    @JsonProperty("subAddr")
    private String subAddr;     // 계열사 주소

    @JsonProperty("isRelease")
    private String isRelease;   // 출고업체 여부 (Y/N)

    // 기본 생성자
    public Subsidiary() {}

    // 매개변수가 있는 생성자
    public Subsidiary(Integer subIdx, String corpIdx, String subName, String subOwner, String subTel, String subAddr, String isRelease) {
        this.subIdx = subIdx;
        this.corpIdx = corpIdx;
        this.subName = subName;
        this.subOwner = subOwner;
        this.subTel = subTel;
        this.subAddr = subAddr;
        this.isRelease = isRelease;
    }

    // Getter and Setter methods
    public Integer getSubIdx() {
        return subIdx;
    }

    public void setSubIdx(Integer subIdx) {
        this.subIdx = subIdx;
    }

    public String getCorpIdx() {
        return corpIdx;
    }

    public void setCorpIdx(String corpIdx) {
        this.corpIdx = corpIdx;
    }

    public String getSubName() {
        return subName;
    }

    public void setSubName(String subName) {
        this.subName = subName;
    }

    public String getSubOwner() {
        return subOwner;
    }

    public void setSubOwner(String subOwner) {
        this.subOwner = subOwner;
    }

    public String getSubTel() {
        return subTel;
    }

    public void setSubTel(String subTel) {
        this.subTel = subTel;
    }

    public String getSubAddr() {
        return subAddr;
    }

    public void setSubAddr(String subAddr) {
        this.subAddr = subAddr;
    }

    public String getIsRelease() {
        return isRelease;
    }

    public void setIsRelease(String isRelease) {
        this.isRelease = isRelease;
    }
}
