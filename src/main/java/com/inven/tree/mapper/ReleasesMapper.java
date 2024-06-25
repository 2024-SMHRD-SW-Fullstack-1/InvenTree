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

<<<<<<< HEAD
    List<Releases> selectReleasesByIds(@Param("list") List<Integer> ids);
    
    void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") Integer prodIdx, 
            @Param("releaseCnt") Integer releaseCnt, @Param("releasedAt") Timestamp releasedAt, 
            @Param("subIdx") Integer subIdx);

    List<Map<String, Object>> selectReleasesWithDetailsFiltered(@Param("offset") int offset,
            @Param("size") int size,
            @Param("filterColumn") String filterColumn,
            @Param("filterValue") String filterValue,
            @Param("corpIdx") String corpIdx);

int countFilteredEntries(@Param("filterColumn") String filterColumn,
@Param("filterValue") String filterValue,
@Param("corpIdx") String corpIdx);
    
    
       
=======
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
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
}

