package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Organizations;
import com.charan.mytaskly.entities.Projects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationsRepository extends JpaRepository<Organizations,String> {

    @Query("SELECT org FROM Organizations org WHERE org.organizationName=:organizationName")
    Organizations getOrganizationsByOrganizationsName(@Param("organizationName") String organizationName);

    @Query("SELECT COUNT(org.organizationsId) FROM Organizations org WHERE org.owner.userId=:userId")
    int getCountOfOrganizationsUnderUserByUserId(@Param("userId") String userId);

    @Query("SELECT org.projects FROM Organizations org WHERE org.organizationsId=:organizationsId")
    List<Projects> getAllProjectByOrganizationId(@Param("organizationsId") String organizationsId);

    @Query("SELECT org FROM Organizations org WHERE org.owner.userId = :userId")
    List<Organizations> getOrganizationByUserId(@Param("userId") String userId);

}
