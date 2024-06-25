package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Releases;
@Mapper
public interface ReleasesMapper {
    void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("releaseCnt") int releaseCnt, @Param("releasedAt") Timestamp releasedAt);
    List<Releases> selectAllReleases();

    List<Map<String, Object>> selectReleasesWithDetailsFiltered(
            @Param("offset") int offset, 
            @Param("size") int size, 
            @Param("filterColumn") String filterColumn, 
            @Param("filterValue") String filterValue
        );

        int countFilteredEntries(
            @Param("filterColumn") String filterColumn, 
            @Param("filterValue") String filterValue
        );
}

