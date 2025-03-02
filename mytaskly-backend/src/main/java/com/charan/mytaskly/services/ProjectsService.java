package com.charan.mytaskly.services;

import com.charan.mytaskly.entities.Projects;

import java.util.List;

public interface ProjectsService {

    Projects saveProject(String organizationName, Projects projects);

    List<Projects> getAllProjects();

    Projects getProjectByProjectId(String projectId);

    Projects updateProjectByProjectId(String projectId, Projects projects);

    String deleteProjectByProjectId(String projectId);
}
