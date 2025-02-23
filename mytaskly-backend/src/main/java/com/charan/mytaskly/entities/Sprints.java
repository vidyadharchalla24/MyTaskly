package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sprints")
public class Sprints {

    @Id
    @Column(name = "sprint_id")
    private UUID sprintId;

    @Column(name = "sprint_name")
    private String sprintName;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Enumerated(EnumType.STRING)
    private SprintStatus sprintStatus;

    @ManyToOne
    @JoinColumn(name = "project_id",nullable = false)
    @JsonBackReference
    private Projects projects;

    @OneToMany(mappedBy = "sprints", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Issues> issues;

    public Sprints() {
        super();
    }

    public Sprints(UUID sprintId, String sprintName, Date startDate, Date endDate, SprintStatus sprintStatus) {
        this.sprintId = sprintId;
        this.sprintName = sprintName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sprintStatus = sprintStatus;
    }

    public UUID getSprintId() {
        return sprintId;
    }

    public void setSprintId(UUID sprintId) {
        this.sprintId = sprintId;
    }

    public String getSprintName() {
        return sprintName;
    }

    public void setSprintName(String sprintName) {
        this.sprintName = sprintName;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public SprintStatus getSprintStatus() {
        return sprintStatus;
    }

    public void setSprintStatus(SprintStatus sprintStatus) {
        this.sprintStatus = sprintStatus;
    }

    public Projects getProjects() {
        return projects;
    }

    public void setProjects(Projects projects) {
        this.projects = projects;
    }

    public List<Issues> getIssues() {
        return issues;
    }

    public void setIssues(List<Issues> issues) {
        this.issues = issues;
    }
}
