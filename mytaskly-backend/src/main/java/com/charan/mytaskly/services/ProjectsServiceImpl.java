package com.charan.mytaskly.services;

import com.charan.mytaskly.entities.*;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.exception.SubscriptionExpiryException;
import com.charan.mytaskly.repository.OrganizationsRepository;
import com.charan.mytaskly.repository.ProjectAssignmentsRepository;
import com.charan.mytaskly.repository.ProjectsRepository;
import com.charan.mytaskly.repository.SubscriptionsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectsServiceImpl implements ProjectsService{

    private final ProjectsRepository projectsRepository;

    private final ProjectAssignmentsRepository projectAssignmentsRepository;

    private final OrganizationsRepository organizationsRepository;

    private final SubscriptionsRepository subscriptionsRepository;

    public ProjectsServiceImpl(ProjectsRepository projectsRepository, ProjectAssignmentsRepository projectAssignmentsRepository, OrganizationsRepository organizationsRepository, SubscriptionsRepository subscriptionsRepository) {
        this.projectsRepository = projectsRepository;
        this.projectAssignmentsRepository = projectAssignmentsRepository;
        this.organizationsRepository = organizationsRepository;
        this.subscriptionsRepository = subscriptionsRepository;
    }

    @Override
    public Projects saveProject(String organizationName, Projects projects) {
        Organizations organizations = organizationsRepository.getOrganizationsByOrganizationsName(organizationName);
        if(organizations == null){
            throw new ResourceNotFoundException("Organization not Found!!");
        }
        Users owner = organizations.getOwner();

        Subscriptions subscription = subscriptionsRepository.getSubscriptionsByUserId(owner.getUserId());
        if (subscription == null) {
            throw new ResourceNotFoundException("Subscriptions not Found!!");
        }

        int projectsCount = projectsRepository.getCountOfProjectsByOrganizationId(organizations.getOrganizationsId());
        int maxAllowedProjects = subscription.getPlan().getMaxProjectsPerOrg();

        // Validate subscription limits
        if (projectsCount >= maxAllowedProjects) {
            throw new SubscriptionExpiryException("Projects limit exceeded for your plan: " + subscription.getPlan().getName());
        }

        Projects newProjects = new Projects();
        newProjects.setProjectId(UUID.randomUUID().toString());
        newProjects.setProjectName(projects.getProjectName());
        newProjects.setProjectDescription(projects.getProjectDescription());
        newProjects.setProjectStatus(ProjectStatus.PLANNED);
        newProjects.setOrganization(organizations);

        Projects saveProject = projectsRepository.save(newProjects);

        ProjectAssignments projectAssignments = new ProjectAssignments();
        projectAssignments.setProjectAssignmentsId(UUID.randomUUID().toString());
        projectAssignments.setUsers(owner);
        projectAssignments.setProjects(saveProject);
        projectAssignments.setRole(Role.OWNER);
        ProjectAssignments savedProjectAssignments = projectAssignmentsRepository.save(projectAssignments);
        saveProject.setProjectAssignments(List.of(savedProjectAssignments));
        return saveProject;
    }

    @Override
    public List<Projects> getAllProjects() {
        List<Projects> projectsList = projectsRepository.findAll();
        if (projectsList.isEmpty()){
            throw new ResourceNotFoundException("No Projects Available!!");
        }

        return projectsList;
    }

    @Override
    public Projects getProjectByProjectId(String projectId) {
        return projectsRepository.findById(projectId).orElseThrow(
                ()-> new ResourceNotFoundException("Project Not Found!!")
        );
    }

    @Override
    public Projects updateProjectByProjectId(String projectId, Projects projects) {
        Projects existingProject = projectsRepository.findById(projectId).orElseThrow(
                ()-> new ResourceNotFoundException("Project doesn't exist!!")
        );
        existingProject.setProjectName(projects.getProjectName());
        existingProject.setProjectDescription(projects.getProjectDescription());
        existingProject.setProjectStatus(projects.getProjectStatus());

        return projectsRepository.save(existingProject);
    }

    @Override
    public String deleteProjectByProjectId(String projectId) {
        Projects existingProject = projectsRepository.findById(projectId).orElseThrow(
                ()-> new ResourceNotFoundException("Project doesn't exist!!")
        );
        projectsRepository.delete(existingProject);
        return "Project deleted successfully!!";
    }

    @Override
    public List<Projects> getProjectByOrganizationName(String organizationName) {
        List<Projects> projectsList = projectsRepository.getProjectByOrganizationName(organizationName);
        if (projectsList.isEmpty()) {
            throw new ResourceNotFoundException("No Projects Available..");
        }
        return projectsList;
    }

}
