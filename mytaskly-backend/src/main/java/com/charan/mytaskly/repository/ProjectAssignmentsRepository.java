package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.ProjectAssignments;
import com.charan.mytaskly.entities.Projects;
import com.charan.mytaskly.entities.Role;
import com.charan.mytaskly.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectAssignmentsRepository extends JpaRepository<ProjectAssignments,String> {

    @Query("SELECT pa.users FROM ProjectAssignments pa WHERE pa.projects.projectId = :projectId AND pa.role = :role")
    List<Users> getUsersByProjectIdAndRole(@Param("projectId") String projectId, @Param("role") Role role);

    boolean existsByUsersAndProjects(Users users, Projects project);

    @Query("SELECT pa FROM ProjectAssignments pa WHERE pa.projects.projectId=:projectId AND pa.users.userId=:userId")
    ProjectAssignments getProjectAssignmentsByProjectIdUserId(@Param("projectId") String projectId,@Param("userId") String userId);

    @Query("SELECT pa FROM ProjectAssignments pa WHERE pa.users.userId=:userId AND pa.role = :role")
    List<ProjectAssignments> getAllProjectAssignmentsByUserIdAndRole(@Param("userId") String userId,@Param("role") Role role);
}
