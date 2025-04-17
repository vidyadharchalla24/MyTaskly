package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.services.ProjectAssignmentsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
