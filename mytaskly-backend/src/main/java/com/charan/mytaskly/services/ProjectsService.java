package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.ProjectDto;
import com.charan.mytaskly.entities.Projects;

import java.util.List;

public interface ProjectsService {

    Projects saveProject(String organizationName, Projects projects);

    Projects updateProjectByProjectId(String projectId, Projects projects);

    String deleteProjectByProjectId(String projectId);

    List<ProjectDto> getProjectByOrganizationName(String organizationName);

}
