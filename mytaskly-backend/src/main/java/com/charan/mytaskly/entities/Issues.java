package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "issues")
public class Issues {

    @Id
    @Column(name = "issue_id")
    private String issueId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_status", length = 20)
    private IssueStatus issueStatus;

    @Enumerated(EnumType.STRING)
    private IssuePriority issuePriority;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private Users assignee;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private Users reporter;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference(value = "issues-projects")
    private Projects projects;

    @ManyToOne
    @JoinColumn(name = "sprint_id")
    @JsonBackReference(value = "issues-sprints")
    private Sprints sprints;

    @OneToMany(mappedBy = "issues", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comments> comments;

    @OneToMany(mappedBy = "issues", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference(value = "attachment-issues")
    private List<Attachments> attachments;

    public Issues() {
        super();
    }

    public Issues(String issueId, String title, String description, IssueStatus issueStatus, IssuePriority issuePriority) {
        this.issueId = issueId;
        this.title = title;
        this.description = description;
        this.issueStatus = issueStatus;
        this.issuePriority = issuePriority;
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

    public Users getAssignee() {
        return assignee;
    }

    public void setAssignee(Users assignee) {
        this.assignee = assignee;
    }

    public Users getReporter() {
        return reporter;
    }

    public void setReporter(Users reporter) {
        this.reporter = reporter;
    }

    public Projects getProjects() {
        return projects;
    }

    public void setProjects(Projects projects) {
        this.projects = projects;
    }

    public Sprints getSprints() {
        return sprints;
    }

    public void setSprints(Sprints sprints) {
        this.sprints = sprints;
    }

    public List<Comments> getComments() {
        return comments;
    }

    public void setComments(List<Comments> comments) {
        this.comments = comments;
    }

    public List<Attachments> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachments> attachments) {
        this.attachments = attachments;
    }
}
