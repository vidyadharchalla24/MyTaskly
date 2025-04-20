package com.charan.mytaskly.dto;

import com.charan.mytaskly.entities.ProjectStatus;
import com.charan.mytaskly.entities.Role;

public class ProjectDto {
    private String projectId;

    private String projectName;

    private String projectDescription;

    private ProjectStatus projectStatus;

    private String role;

    public ProjectDto(String projectId, String projectName, String projectDescription, ProjectStatus projectStatus,String role) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.projectStatus = projectStatus;
        this.role = role;
    }

    public ProjectDto() {
        super();
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public ProjectStatus getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(ProjectStatus projectStatus) {
        this.projectStatus = projectStatus;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
