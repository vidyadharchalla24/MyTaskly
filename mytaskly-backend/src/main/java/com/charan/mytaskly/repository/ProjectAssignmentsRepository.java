package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.ProjectAssignments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectAssignmentsRepository extends JpaRepository<ProjectAssignments,String> {
}
