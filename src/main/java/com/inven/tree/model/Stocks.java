package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Timestamp;

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
    private Timestamp stockedAt;
<<<<<<< HEAD
    
    @JsonProperty("subIdx")
    private Integer subIdx;
    
    
    
    
=======
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f

  

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

<<<<<<< HEAD
    public Integer getSubIdx() {
		return subIdx;
	}

	public void setSubIdx(Integer subIdx) {
		this.subIdx = subIdx;
	}

	public void setProdIdx(int prodIdx) {
=======
    public void setProdIdx(int prodIdx) {
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
        this.prodIdx = prodIdx;
    }

    public int getStockCnt() {
        return stockCnt;
    }

    public void setStockCnt(int stockCnt) {
        this.stockCnt = stockCnt;
    }

    public Timestamp getStockedAt() {
        return stockedAt;
    }

    public void setStockedAt(Timestamp stockedAt) {
        this.stockedAt = stockedAt;
    }

 
}
