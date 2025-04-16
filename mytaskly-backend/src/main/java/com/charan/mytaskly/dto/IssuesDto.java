package com.charan.mytaskly.dto;

import com.charan.mytaskly.entities.IssuePriority;
import com.charan.mytaskly.entities.IssueStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class IssuesDto {
    private String issueId;
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotNull(message = "Issue Status is required")
    private IssueStatus issueStatus;

    @NotNull(message = "Issue Priority is required")
    private IssuePriority issuePriority;
    private String assigneeEmail;
    private String reporterEmail;
    private String projectId;
    private String sprintId;

    public IssuesDto() {
        super();
    }

    public IssuesDto(String issueId, String title, String description, IssueStatus issueStatus, IssuePriority issuePriority, String assigneeEmail, String reporterEmail) {
        this.issueId = issueId;
        this.title = title;
        this.description = description;
        this.issueStatus = issueStatus;
        this.issuePriority = issuePriority;
        this.assigneeEmail = assigneeEmail;
        this.reporterEmail = reporterEmail;
    }

    public String getIssueId() {
        return issueId;
    }

    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IssueStatus getIssueStatus() {
        return issueStatus;
    }

    public void setIssueStatus(IssueStatus issueStatus) {
        this.issueStatus = issueStatus;
    }

    public IssuePriority getIssuePriority() {
        return issuePriority;
    }

    public void setIssuePriority(IssuePriority issuePriority) {
        this.issuePriority = issuePriority;
    }

    public String getAssigneeEmail() {
        return assigneeEmail;
    }

    public void setAssigneeEmail(String assigneeEmail) {
        this.assigneeEmail = assigneeEmail;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getSprintId() {
        return sprintId;
    }

    public void setSprintId(String sprintId) {
        this.sprintId = sprintId;
    }
}
