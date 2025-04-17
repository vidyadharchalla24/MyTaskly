package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.IssuesDto;
import com.charan.mytaskly.entities.Issues;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IssuesService {

    String saveIssues(String sprintId, IssuesDto issuesDto);

    IssuesDto getIssueByIssueId(String issueId);

    List<Issues> getAllIssuesBySprintId(String sprintId);

    List<Issues> getAllIssues();

    String updateAllIssueDetailsByIssueId(String issueId, IssuesDto issuesDto);

    String updateIssueStatusByIssueId(String issueId, String issueStatus);

    String deleteIssueByIssueId(String issueId);
}
