package com.charan.mytaskly.controllers;

import com.charan.mytaskly.entities.Projects;
import com.charan.mytaskly.services.ProjectsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectsController {

    private final ProjectsService projectsService;

    public ProjectsController(ProjectsService projectsService) {
        this.projectsService = projectsService;
    }

    @PostMapping("/{organizationName}")
    public ResponseEntity<Projects> saveProject(@PathVariable("organizationName") String organizationName, @RequestBody Projects projects){
        return ResponseEntity.ok(projectsService.saveProject(organizationName,projects));
    }

    @GetMapping
    public ResponseEntity<List<Projects>> getAllProjects(){
        return ResponseEntity.ok(projectsService.getAllProjects());
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Projects> getProjectByProjectId(@PathVariable("projectId") String projectId){
        return ResponseEntity.ok(projectsService.getProjectByProjectId(projectId));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<Projects> updateProjectByProjectId(@PathVariable("projectId") String projectId,@RequestBody Projects projects){
        return ResponseEntity.ok(projectsService.updateProjectByProjectId(projectId,projects));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<String> deleteProjectByProjectId(@PathVariable("projectId") String projectId){
        return ResponseEntity.ok(projectsService.deleteProjectByProjectId(projectId));
    }
    @GetMapping("/{organizationName}/organizationName")
    public ResponseEntity<List<Projects>> getProjectByOrganizationName(@PathVariable("organizationName") String organizationName){
        return ResponseEntity.ok(projectsService.getProjectByOrganizationName(organizationName));
    }
}
