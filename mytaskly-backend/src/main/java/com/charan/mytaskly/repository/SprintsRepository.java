package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Sprints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SprintsRepository extends JpaRepository<Sprints,String> {

    @Query("SELECT s FROM Sprints s WHERE s.projects.projectId =:projectId")
    List<Sprints> getAllSprintsByProjectId(@Param("projectId") String projectId);

    @Query("SELECT s FROM Sprints s WHERE s.endDate = :date")
    List<Sprints> findSprintsEndingOn(@Param("date") LocalDate date);

    @Query("SELECT DISTINCT s FROM Sprints s JOIN s.issues i WHERE i.assignee.userId =:userId")
    List<Sprints> findByIssuesAssigneeUserId(@Param("userId") String userId);
}
