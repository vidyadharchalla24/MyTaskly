package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.IssuesDto;
import com.charan.mytaskly.entities.Issues;

import java.util.List;

public interface IssuesService {

    String saveIssues(String sprintId, IssuesDto issuesDto);

    Issues getIssueByIssueId(String issueId);

    List<Issues> getAllIssuesBySprintId(String sprintId);

    List<Issues> getAllIssues();

    String updateAllIssueDetailsByIssueId(String issueId, Issues issues);

    String updateIssueStatusByIssueId(String issueId, String issueStatus);
}
