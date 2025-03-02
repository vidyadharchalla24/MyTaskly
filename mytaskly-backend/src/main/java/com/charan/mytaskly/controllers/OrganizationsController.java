package com.charan.mytaskly.controllers;

import com.charan.mytaskly.entities.Organizations;
import com.charan.mytaskly.entities.Projects;
import com.charan.mytaskly.services.OrganizationsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizations")
public class OrganizationsController {

    private final OrganizationsService organizationsService;

    public OrganizationsController(OrganizationsService organizationsService) {
        this.organizationsService = organizationsService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<String> saveOrganizations(@PathVariable("userId") String userId, @RequestParam String organizationName){
        return ResponseEntity.ok(organizationsService.saveOrganizations(userId,organizationName));
    }

    @GetMapping
    public ResponseEntity<List<Organizations>> getAllOrganizations(){
        return ResponseEntity.ok(organizationsService.getAllOrganizations());
    }

    @GetMapping("/{organizationsId}")
    public ResponseEntity<Organizations> getOrganizationByOrganizationsId(@PathVariable String organizationsId){
        return ResponseEntity.ok(organizationsService.getOrganizationByOrganizationsId(organizationsId));
    }

    @PutMapping("/{organizationsId}")
    public ResponseEntity<String> updateOrganizationName(@RequestParam String organizationName){
        return ResponseEntity.ok(organizationsService.updateOrganizationName(organizationName));
    }

    @DeleteMapping
    public ResponseEntity<String> deleteOrganization(@RequestParam String organizationName){
        return ResponseEntity.ok(organizationsService.deleteOrganization(organizationName));
    }

    @GetMapping("/{organizationsId}/projects")
    ResponseEntity<List<Projects>> getAllProjectByOrganizationId(@PathVariable("organizationsId") String organizationsId){
        return ResponseEntity.ok(organizationsService.getAllProjectByOrganizationId(organizationsId));
    }

}
