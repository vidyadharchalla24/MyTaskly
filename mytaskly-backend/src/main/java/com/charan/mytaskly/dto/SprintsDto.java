package com.charan.mytaskly.dto;

import com.charan.mytaskly.entities.Issues;
import com.charan.mytaskly.entities.SprintStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;
import java.util.List;

public class SprintsDto {
    private String sprintId;

    private String sprintName;

    private LocalDate startDate;

    private LocalDate endDate;

    private SprintStatus sprintStatus;

    private List<IssuesDto> issues;

    public SprintsDto(String sprintId, String sprintName, LocalDate startDate, LocalDate endDate, SprintStatus sprintStatus, List<IssuesDto> issues) {
        this.sprintId = sprintId;
        this.sprintName = sprintName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sprintStatus = sprintStatus;
        this.issues = issues;
    }

    public SprintsDto() {
        super();
    }

    public String getSprintId() {
        return sprintId;
    }

    public void setSprintId(String sprintId) {
        this.sprintId = sprintId;
    }

    public String getSprintName() {
        return sprintName;
    }

    public void setSprintName(String sprintName) {
        this.sprintName = sprintName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public SprintStatus getSprintStatus() {
        return sprintStatus;
    }

    public void setSprintStatus(SprintStatus sprintStatus) {
        this.sprintStatus = sprintStatus;
    }

    public List<IssuesDto> getIssues() {
        return issues;
    }

    public void setIssues(List<IssuesDto> issues) {
        this.issues = issues;
    }
}
