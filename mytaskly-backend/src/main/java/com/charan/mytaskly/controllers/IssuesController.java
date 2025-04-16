package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.IssuesDto;
import com.charan.mytaskly.entities.Issues;
import com.charan.mytaskly.services.IssuesService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/issues")
public class IssuesController {

    private final IssuesService issuesService;

    public IssuesController(IssuesService issuesService) {
        this.issuesService = issuesService;
    }

    @PostMapping("/{sprintId}/sprint")
    public ResponseEntity<String> saveIssues(@PathVariable("sprintId") String sprintId,@Valid @RequestBody IssuesDto issuesDto){
        return ResponseEntity.ok(issuesService.saveIssues(sprintId,issuesDto));
    }

    @GetMapping("/{issueId}")
    public ResponseEntity<Issues> getIssueByIssueId(@PathVariable("issueId") String issueId){
        return ResponseEntity.ok(issuesService.getIssueByIssueId(issueId));
    }

    @GetMapping("/{sprintId}/sprints")
    public ResponseEntity<List<Issues>> getAllIssuesBySprintId(@PathVariable("sprintId") String sprintId){
        return ResponseEntity.ok(issuesService.getAllIssuesBySprintId(sprintId));
    }

    @GetMapping
    public ResponseEntity<List<Issues>> getAllIssues(){
        return ResponseEntity.ok(issuesService.getAllIssues());
    }

    @PutMapping("/updateIssue/{issueId}")
    public ResponseEntity<String> updateAllIssueDetailsByIssueId(@PathVariable("issueId") String issueId,@RequestBody Issues issues){
        return ResponseEntity.ok(issuesService.updateAllIssueDetailsByIssueId(issueId,issues));
    }

    @PutMapping("/{issueId}/priority/{issueStatus}")
    public ResponseEntity<String> updateIssuePriorityByIssueId(@PathVariable("issueId") String issueId,@PathVariable("issueStatus") String issueStatus){
        return ResponseEntity.ok(issuesService.updateIssueStatusByIssueId(issueId,issueStatus));
    }


}
