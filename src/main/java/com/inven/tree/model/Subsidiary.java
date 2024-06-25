package com.inven.tree.model;

public class Subsidiary {
    private int subIdx;      // 계열사 고유키
    private String corpIdx;  // 회사 고유키 참조
    private String subName;  // 계열사 명
    private String subOwner; // 계열사 대표자명
    private String subTel;   // 계열사 전화번호
    private String subAddr;  // 계열사 주소
    private String isRelease;// 출고업체 여부 (Y/N)

    // 기본 생성자
    public Subsidiary() {}

    // 매개변수가 있는 생성자
    public Subsidiary(int subIdx, String corpIdx, String subName, String subOwner, String subTel, String subAddr, String isRelease) {
        this.subIdx = subIdx;
        this.corpIdx = corpIdx;
        this.subName = subName;
        this.subOwner = subOwner;
        this.subTel = subTel;
        this.subAddr = subAddr;
        this.isRelease = isRelease;
    }

    // Getter and Setter methods
    public int getSubIdx() {
        return subIdx;
    }

    public void setSubIdx(int subIdx) {
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
