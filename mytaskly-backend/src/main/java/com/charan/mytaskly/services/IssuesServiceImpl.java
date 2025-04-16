package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.IssuesDto;
import com.charan.mytaskly.entities.*;
import com.charan.mytaskly.exception.InvalidInputException;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.repository.IssuesRepository;
import com.charan.mytaskly.repository.ProjectsRepository;
import com.charan.mytaskly.repository.SprintsRepository;
import com.charan.mytaskly.repository.UsersRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class IssuesServiceImpl implements IssuesService{

    private final IssuesRepository issuesRepository;

    private final SprintsRepository sprintsRepository;

    private final ProjectsRepository projectsRepository;

    private final UsersRepository usersRepository;

    public IssuesServiceImpl(IssuesRepository issuesRepository, SprintsRepository sprintsRepository, ProjectsRepository projectsRepository, UsersRepository usersRepository) {
        this.issuesRepository = issuesRepository;
        this.sprintsRepository = sprintsRepository;
        this.projectsRepository = projectsRepository;
        this.usersRepository = usersRepository;
    }

    @Override
    public String saveIssues(String sprintId, IssuesDto issuesDto) {

        Issues issues = new Issues();
        // need to optimize this query where we need only specific things related to sprints not nested things
        // need to do it for all things
        Sprints sprints = sprintsRepository.findById(sprintId).orElseThrow(
                ()-> new ResourceNotFoundException("Sprint Not Found!!")
        );

        Projects projects = projectsRepository.findById(issuesDto.getProjectId()).orElseThrow(
                ()-> new ResourceNotFoundException("Project Not Found!!")
        );
        if(issuesDto.getAssigneeEmail().isEmpty()){
            throw new ResourceNotFoundException("Please provide Assignee Email!!");
        }
        if (issuesDto.getReporterEmail().isEmpty()){
            throw new ResourceNotFoundException("Please provide Reporter Email!!");
        }

        if(issuesDto.getReporterEmail().equals(issuesDto.getAssigneeEmail())){
            Users assigneeAndReporter = usersRepository.findByEmail(issuesDto.getAssigneeEmail()).orElseThrow(
                    ()-> new ResourceNotFoundException("No Assignee exists!!")
            );
            issues.setAssignee(assigneeAndReporter);
            issues.setReporter(assigneeAndReporter);

        }else {
            Users assignee = usersRepository.findByEmail(issuesDto.getAssigneeEmail()).orElseThrow(
                    ()-> new ResourceNotFoundException("No Assignee exists!!")
            );

            Users reporter = usersRepository.findByEmail(issuesDto.getReporterEmail()).orElseThrow(
                    ()-> new ResourceNotFoundException("No Reporter exists!!")
            );
            issues.setAssignee(assignee);
            issues.setReporter(reporter);

        }

//        Issues newIssue = new Issues();
        issues.setIssueId(UUID.randomUUID().toString());
        issues.setIssuePriority(issuesDto.getIssuePriority());
        issues.setIssueStatus(issuesDto.getIssueStatus());
        issues.setTitle(issuesDto.getTitle());
        issues.setDescription(issuesDto.getDescription());
        issues.setProjects(projects);
        issues.setSprints(sprints);
        issuesRepository.save(issues);

        return "Issue added successfully!!";
    }

    @Override
    public Issues getIssueByIssueId(String issueId) {
        return issuesRepository.findById(issueId).orElseThrow(
                ()-> new ResourceNotFoundException("Issue Not Found!!")
        );
    }

    @Override
    public List<Issues> getAllIssuesBySprintId(String sprintId) {
        List<Issues> issuesList = issuesRepository.getAllIssuesBySprintId(sprintId);
        if (issuesList.isEmpty()) {
            throw new ResourceNotFoundException("Issues Not Exists");
        }
        return issuesList;
    }

    @Override
    public List<Issues> getAllIssues() {
        List<Issues> issuesList = issuesRepository.findAll();
        if(issuesList.isEmpty()){
            throw new ResourceNotFoundException("No Issues Exist");
        }
        return issuesList;
    }

    @Override
    public String updateAllIssueDetailsByIssueId(String issueId, Issues issues) {
        Issues existingIssue = issuesRepository.findById(issueId).orElseThrow(
                ()-> new ResourceNotFoundException("Issue Not Found!!")
        );
        existingIssue.setIssuePriority(issues.getIssuePriority());
        existingIssue.setIssueStatus(issues.getIssueStatus());
        existingIssue.setTitle(issues.getTitle());
        existingIssue.setDescription(issues.getDescription());
        existingIssue.setAssignee(issues.getAssignee());
        existingIssue.setReporter(issues.getReporter());
        issuesRepository.save(existingIssue);

        return "Issue Updated Successfully!!";
    }

    @Override
    public String updateIssueStatusByIssueId(String issueId, String issueStatus) {
        Issues issues = issuesRepository.findById(issueId).orElseThrow(()-> new ResourceNotFoundException("Issue Id not found"));
        try {
            issues.setIssueStatus(IssueStatus.valueOf(issueStatus));
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid issue status: " + issueStatus);
        }

        issuesRepository.save(issues);
        return "IssuePriority updated successfully!!";
    }
}
