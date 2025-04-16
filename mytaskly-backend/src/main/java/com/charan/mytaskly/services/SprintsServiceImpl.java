package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.IssuesDto;
import com.charan.mytaskly.dto.SprintsDto;
import com.charan.mytaskly.entities.Projects;
import com.charan.mytaskly.entities.SprintStatus;
import com.charan.mytaskly.entities.Sprints;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.repository.ProjectsRepository;
import com.charan.mytaskly.repository.SprintsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SprintsServiceImpl implements SprintsService{

    private final SprintsRepository sprintsRepository;

    private final ProjectsRepository projectsRepository;

    public SprintsServiceImpl(SprintsRepository sprintsRepository, ProjectsRepository projectsRepository) {
        this.sprintsRepository = sprintsRepository;
        this.projectsRepository = projectsRepository;
    }

    @Override
    public Sprints saveSprints(String projectId, Sprints sprints) {
        Projects projects = projectsRepository.findById(projectId).orElseThrow(
                ()-> new ResourceNotFoundException("Project not found!!")
        );
        Sprints newSprints = new Sprints();
        newSprints.setSprintId(UUID.randomUUID().toString());
        newSprints.setSprintName(sprints.getSprintName());
        newSprints.setStartDate(sprints.getStartDate());
        newSprints.setEndDate(sprints.getEndDate());
        newSprints.setSprintStatus(SprintStatus.NOT_STARTED);
        newSprints.setProjects(projects);

        return sprintsRepository.save(newSprints);
    }

    @Override
    public List<Sprints> getAllSprints() {
        return sprintsRepository.findAll();
    }

    @Override
    public Sprints getSprintBySprintId(String sprintId) {
        return sprintsRepository.findById(sprintId).orElseThrow(
                ()-> new ResourceNotFoundException("No Sprint Exists!!")
        );
    }

    @Override
    public List<SprintsDto> getAllSprintsByProjectId(String projectId) {
        List<Sprints> sprintsList = sprintsRepository.getAllSprintsByProjectId(projectId);

        return sprintsList.stream().map(sprint -> {
            List<IssuesDto> issuesDtoList = sprint.getIssues().stream().map(issue ->
                    new IssuesDto(
                            issue.getIssueId(),
                            issue.getTitle(),
                            issue.getDescription(),
                            issue.getIssueStatus(),
                            issue.getIssuePriority(),
                            issue.getAssignee() != null ? issue.getAssignee().getEmail() : null,
                            issue.getReporter() != null ? issue.getReporter().getEmail() : null
                    )
            ).collect(Collectors.toList());

            return new SprintsDto(
                    sprint.getSprintId(),
                    sprint.getSprintName(),
                    sprint.getStartDate(),
                    sprint.getEndDate(),
                    sprint.getSprintStatus(),
                    issuesDtoList
            );
        }).collect(Collectors.toList());
    }


    @Override
    public String updateSprintBySprintId(String sprintId, Sprints sprints) {
        Sprints existingSprints = sprintsRepository.findById(sprintId).orElseThrow(
                ()-> new ResourceNotFoundException("No Sprints Found!!")
        );
        existingSprints.setSprintName(sprints.getSprintName());
        existingSprints.setStartDate(sprints.getStartDate());
        existingSprints.setEndDate(sprints.getEndDate());
        sprintsRepository.save(existingSprints);

        return "Updated Sprint Successfully!!";
    }

    @Override
    public String deleteSprintBySprintId(String sprintId) {
        Sprints sprints = sprintsRepository.findById(sprintId).orElseThrow(
                ()-> new ResourceNotFoundException("No Sprint Found!!")
        );
        sprintsRepository.delete(sprints);
        return "Sprint deleted Successfully!!";
    }

    @Override
    public String updateSprintStatus(String sprintId,String sprintStatus) {
        Sprints sprints = sprintsRepository.findById(sprintId).orElseThrow(
                ()-> new ResourceNotFoundException("No Sprint Found!!")
        );
        sprints.setSprintStatus(SprintStatus.valueOf(sprintStatus));
        sprintsRepository.save(sprints);
        return "Sprint Status Updated Successfully!!";
    }


}
