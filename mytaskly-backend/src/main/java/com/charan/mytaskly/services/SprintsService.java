package com.charan.mytaskly.services;

import com.charan.mytaskly.entities.Sprints;

import java.util.List;

public interface SprintsService {
    Sprints saveSprints(String projectId, Sprints sprints);

    List<Sprints> getAllSprints();

    Sprints getSprintBySprintId(String sprintId);

    List<Sprints> getAllSprintsByProjectId(String projectId);

    String updateSprintBySprintId(String sprintId, Sprints sprints);

    String deleteSprintBySprintId(String sprintId);

    String updateSprintStatus(String sprintId,String sprintStatus);
}
