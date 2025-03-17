package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Projects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectsRepository extends JpaRepository<Projects,String> {

    @Query("SELECT COUNT(proj.projectId) FROM Projects proj WHERE proj.organization.organizationsId=:organizationsId")
    int getCountOfProjectsByOrganizationId(@Param("organizationsId") String organizationsId);

    @Query("SELECT p FROM Projects p WHERE p.organization.organizationName =:organizationName")
    List<Projects> getProjectByOrganizationName(@Param("organizationName") String organizationName);

}
