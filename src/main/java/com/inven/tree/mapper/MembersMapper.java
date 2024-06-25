package com.inven.tree.mapper;

import java.util.List;
import com.inven.tree.model.Auths;
import com.inven.tree.model.Members;

public interface MembersMapper {
    int login(Members members);
    List<Members> findAllMembers();
    void save(Members member);
    void delete(Members member); // 삭제 메서드
    void deleteAuthsByMemberId(String mbId); // 멤버 아이디로 auths 레코드 삭제
    List<Auths> findAllAuths();
    void saveAuth(Auths auth);
    List<Members> findMembersByCorpIdx(String corpIdx);
}
