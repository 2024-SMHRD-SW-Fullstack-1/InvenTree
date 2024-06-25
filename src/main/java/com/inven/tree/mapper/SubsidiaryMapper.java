package com.inven.tree.mapper;

import com.inven.tree.model.Subsidiary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SubsidiaryMapper {

    List<Subsidiary> selectSubsidiaryByNameIgnoreCase(@Param("subName") String subName);

    List<String> selectDistinctByColumnAndCorpIdx(@Param("column") String column, @Param("corpIdx") String corpIdx);
    @Select("SELECT sub_idx FROM subsidiary WHERE sub_name = #{subName}")
    List<Integer> selectSubIdxByCompanyName(@Param("subName") String subName);
}
