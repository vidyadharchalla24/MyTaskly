package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.SprintsDto;
import com.charan.mytaskly.entities.Sprints;
import com.charan.mytaskly.exception.ResourceNotFoundException;

import java.util.List;

public interface SprintsService {
    Sprints saveSprints(String projectId, Sprints sprints);

    List<Sprints> getAllSprints();

    Sprints getSprintBySprintId(String sprintId);

    List<SprintsDto> getAllSprintsByProjectId(String projectId);

    String updateSprintBySprintId(String sprintId, Sprints sprints);

    String deleteSprintBySprintId(String sprintId);

    String updateSprintStatus(String sprintId,String sprintStatus);

    List<SprintsDto> getAllSprintsByUserId(String userId);
}
