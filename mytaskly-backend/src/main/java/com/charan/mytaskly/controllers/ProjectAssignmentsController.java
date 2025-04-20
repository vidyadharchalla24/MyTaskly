package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.ProjectDto;
import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.services.ProjectAssignmentsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects-assignments")
public class ProjectAssignmentsController {

    private final ProjectAssignmentsService projectAssignmentsService;

    public ProjectAssignmentsController(ProjectAssignmentsService projectAssignmentsService) {
        this.projectAssignmentsService = projectAssignmentsService;
    }

    @GetMapping("/{projectId}/collaborators")
    public ResponseEntity<List<UsersDto>> getAllCollaboratorsByProjectId(@PathVariable String projectId){
        return ResponseEntity.ok(projectAssignmentsService.getAllCollaboratorsByProjectId(projectId));
    }

    @DeleteMapping("/{projectId}/collaborators/{userId}")
    public ResponseEntity<String> deleteCollaboratorByProjectIdAndUserId(@PathVariable("projectId") String projectId,@PathVariable("userId") String userId){
        return ResponseEntity.ok(projectAssignmentsService.deleteCollaboratorByProjectIdAndUserId(projectId,userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectDto>> getAllProjectAssignmentsByUserIdAndRole(@PathVariable String userId){
        return ResponseEntity.ok(projectAssignmentsService.getAllProjectAssignmentsByUserIdAndRole(userId));
    }

}
