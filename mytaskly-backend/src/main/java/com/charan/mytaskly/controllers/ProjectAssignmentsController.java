package com.charan.mytaskly.controllers;

import com.charan.mytaskly.services.ProjectAssignmentsService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projects-assignments")
public class ProjectAssignmentsController {

    private final ProjectAssignmentsService projectAssignmentsService;

    public ProjectAssignmentsController(ProjectAssignmentsService projectAssignmentsService) {
        this.projectAssignmentsService = projectAssignmentsService;
    }



}
