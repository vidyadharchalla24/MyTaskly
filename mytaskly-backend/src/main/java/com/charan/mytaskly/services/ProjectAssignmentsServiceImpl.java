package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.entities.ProjectAssignments;
import com.charan.mytaskly.entities.Role;
import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.repository.ProjectAssignmentsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectAssignmentsServiceImpl implements ProjectAssignmentsService{

    private final ProjectAssignmentsRepository projectAssignmentsRepository;

    public ProjectAssignmentsServiceImpl(ProjectAssignmentsRepository projectAssignmentsRepository) {
        this.projectAssignmentsRepository = projectAssignmentsRepository;
    }

    @Override
    public List<UsersDto> getAllCollaboratorsByProjectId(String projectId) {
        List<Users> developers = projectAssignmentsRepository.getUsersByProjectIdAndRole(projectId, Role.DEV);

        return developers.stream().map(user -> new UsersDto(
                user.getEmail(),
                user.getUserId(),
                user.getName(),
                user.getImageUrl()
        )).collect(Collectors.toList());
    }

    @Override
    public String deleteCollaboratorByProjectIdAndUserId(String projectId, String userId) {
        ProjectAssignments projectAssignments = projectAssignmentsRepository.getProjectAssignmentsByProjectIdUserId(projectId,userId);
        projectAssignmentsRepository.delete(projectAssignments);
        return "Collaborator deleted successfully!!";
    }
}
