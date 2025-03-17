package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Issues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssuesRepository extends JpaRepository<Issues,String> {

    @Query("SELECT i FROM Issues i WHERE i.sprints.sprintId=:sprintId")
    List<Issues> getAllIssuesBySprintId(@Param("sprintId") String sprintId);
}
