package com.inven.tree.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Subsidiary;

public interface SubsidiaryMapper {
	
	
	List<Subsidiary> selectIncomingSubsidiariesByCorpIdx(@Param("corpIdx") String corpIdx);
    List<Subsidiary> selectOutgoingSubsidiariesByCorpIdx(@Param("corpIdx") String corpIdx);
    Integer selectSubIdxByName(@Param("subName") String subName, @Param("isRelease") String isRelease);
    String selectSubNameBySubIdx(@Param("subIdx") int subIdx, @Param("isRelease") String isRelease);


		List<Subsidiary> selectAllSubsidiary();
}
