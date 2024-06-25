package com.inven.tree.mapper;

import java.util.List;
import com.inven.tree.model.Auths;
import com.inven.tree.model.Members;

public interface MembersMapper {
    // 로그인 메소드
    int login(Members members);

    // 모든 멤버 정보 가져오기
    List<Members> findAllMembers();

    // 멤버 정보 저장하기
    void save(Members member);

    // 멤버 정보 삭제하기
    void delete(Members member);

    // 멤버 권한 삭제
    void deleteAuthsByMemberId(String mbId);

    // 모든 권한 정보 가져오기
    List<Auths> findAllAuths();

    // 권한 정보 저장
    void saveAuth(Auths auth);

    // 사용자의 회사 코드로 멤버 정보 불러오기
    List<Members> findMembersByCorpIdx(String corpIdx);
}
