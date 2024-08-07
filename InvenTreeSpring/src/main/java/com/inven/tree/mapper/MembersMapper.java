package com.inven.tree.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

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

	// 새로운 권한 조회 메서드 (권한 제한)
	Auths getPermissions(String mbId);

	// 특정 회원 정보 가져오기
	Members findByIdAndCorpIdx(@Param("mbId") String mbId, @Param("corpIdx") String corpIdx);

	// 특정 회원의 권한 정보 가져오기
	Auths findAuthsByMbIdAndCorpIdx(@Param("mbId") String mbId, @Param("corpIdx") String corpIdx);

	// 다크모드로 인하여 추가
	String getMbTheme(String mbId);

	// 회원 테마를 업데이트하는 메서드
	void updateMbTheme(@Param("mbId") String mbId, @Param("theme") String theme);

	// 회원 정보를 업데이트하는 메서드
	void updateMember(Members member);

	// 회원의 권한 정보를 업데이트하는 메서드
	void updateAuth(Auths auth);

}
