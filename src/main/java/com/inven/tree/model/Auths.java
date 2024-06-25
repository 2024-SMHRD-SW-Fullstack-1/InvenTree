package com.inven.tree.model;

public class Auths {
    private Integer authIdx; // 권한 식별자 (pk)
    private String mbId; // 회원 아이디 (fk)
    private char inventoryYn; // 재고 권한
    private char shipYn; // 입출고 권한
    private char chartYn; // 통계 권한
    private char setYn; // 설정 권한

    // 기본 생성자
    public Auths() {
    }

    // 모든 필드를 포함하는 생성자
    public Auths(Integer authIdx, String mbId, char inventoryYn, char shipYn, char chartYn, char setYn) {
        this.authIdx = authIdx;
        this.mbId = mbId;
        this.inventoryYn = inventoryYn;
        this.shipYn = shipYn;
        this.chartYn = chartYn;
        this.setYn = setYn;
    }

    // Getter와 Setter 메소드
    public Integer getAuthIdx() {
        return authIdx;
    }

    public void setAuthIdx(Integer authIdx) {
        this.authIdx = authIdx;
    }

    public String getMbId() {
        return mbId;
    }

    public void setMbId(String mbId) {
        this.mbId = mbId;
    }

    public char getInventoryYn() {
        return inventoryYn;
    }

    public void setInventoryYn(char inventoryYn) {
        this.inventoryYn = inventoryYn;
    }

    public char getShipYn() {
        return shipYn;
    }

    public void setShipYn(char shipYn) {
        this.shipYn = shipYn;
    }

    public char getChartYn() {
        return chartYn;
    }

    public void setChartYn(char chartYn) {
        this.chartYn = chartYn;
    }

    public char getSetYn() {
        return setYn;
    }

    public void setSetYn(char setYn) {
        this.setYn = setYn;
    }

    // toString 메소드
    @Override
    public String toString() {
        return "Auths{" +
                "authIdx=" + authIdx +
                ", mbId='" + mbId + '\'' +
                ", inventoryYn=" + inventoryYn +
                ", shipYn=" + shipYn +
                ", chartYn=" + chartYn +
                ", setYn=" + setYn +
                '}';
    }
}
