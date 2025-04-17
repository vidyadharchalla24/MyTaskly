package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.UsersDto;

import java.util.List;

public interface ProjectAssignmentsService {
    List<UsersDto> getAllCollaboratorsByProjectId(String projectId);

    String deleteCollaboratorByProjectIdAndUserId(String projectId, String userId);
}
