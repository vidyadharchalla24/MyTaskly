package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Sprints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintsRepository extends JpaRepository<Sprints,String> {

    @Query("SELECT s FROM Sprints s WHERE s.projects.projectId =:projectId")
    List<Sprints> getAllSprintsByProjectId(@Param("projectId") String projectId);

}
