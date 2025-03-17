package com.charan.mytaskly.controllers;

import com.charan.mytaskly.entities.Sprints;
import com.charan.mytaskly.services.SprintsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sprints")
public class SprintsController {

    private final SprintsService sprintsService;

    public SprintsController(SprintsService sprintsService) {
        this.sprintsService = sprintsService;
    }

    @PostMapping("/{projectId}")
    public ResponseEntity<Sprints> saveSprints(@PathVariable("projectId") String projectId, @RequestBody Sprints sprints){
        return ResponseEntity.ok(sprintsService.saveSprints(projectId,sprints));
    }

    @GetMapping
    public ResponseEntity<List<Sprints>> getAllSprints(){
        return ResponseEntity.ok(sprintsService.getAllSprints());
    }

    @GetMapping("/singleSprint/{sprintId}")
    public ResponseEntity<Sprints> getSprintBySprintId(@PathVariable("sprintId") String sprintId){
        return ResponseEntity.ok(sprintsService.getSprintBySprintId(sprintId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Sprints>> getAllSprintsByProjectId(@PathVariable("projectId") String projectId){
        return ResponseEntity.ok(sprintsService.getAllSprintsByProjectId(projectId));
    }

    @PutMapping("/{sprintId}")
    public ResponseEntity<String> updateSprintBySprintId(@PathVariable("sprintId") String sprintId,@RequestBody Sprints sprints){
        return ResponseEntity.ok(sprintsService.updateSprintBySprintId(sprintId,sprints));
    }

    @DeleteMapping("/{sprintId}")
    public ResponseEntity<String> deleteSprintBySprintId(@PathVariable("sprintId") String sprintId){
        return ResponseEntity.ok(sprintsService.deleteSprintBySprintId(sprintId));
    }

    @PatchMapping("/{sprintId}/status")
    public ResponseEntity<String> updateSprintStatus(@PathVariable("sprintId") String sprintId,@RequestParam String sprintStatus){
        return ResponseEntity.ok(sprintsService.updateSprintStatus(sprintId,sprintStatus));
    }

}
