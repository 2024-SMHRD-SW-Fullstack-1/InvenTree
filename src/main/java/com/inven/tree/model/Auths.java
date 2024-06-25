package com.inven.tree.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Auths {
    private int authIdx; // 권한 식별자 (pk)
    private String mbId; // 회원 아이디 (fk)
    private char inventoryYn; // 재고 권한
    private char shipYn; // 출고 권한
    private char chartYn; // 차트 권한
    private char setYn; // 설정 권한
}
