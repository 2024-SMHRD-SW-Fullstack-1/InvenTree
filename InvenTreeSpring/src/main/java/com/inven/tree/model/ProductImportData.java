package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductImportData {

    @JsonProperty("prodBarcode")
    private String prodBarcode;

    @JsonProperty("prodName")
    private String prodName;

    @JsonProperty("stockCnt")
    private int stockCnt;

    @JsonProperty("corpName")
    private String corpName;
    
    @JsonProperty("shelfId")
    private String shelfId; // 추가
    @JsonProperty("rackId")
    private String rackId;  // 추가
    @JsonProperty("prodInfo")
    private String prodInfo; // 추가
}
