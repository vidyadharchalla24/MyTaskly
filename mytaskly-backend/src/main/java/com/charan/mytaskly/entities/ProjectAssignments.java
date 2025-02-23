package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "project_assignments")
public class ProjectAssignments {

    @Id
    @Column(name = "project_assignments_id")
    private UUID projectAssignmentsId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private Users users;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference
    private Projects projects;

    public ProjectAssignments() {
        super();
    }

    public ProjectAssignments(UUID projectAssignmentsId, Role role, Users users, Projects projects) {
        this.projectAssignmentsId = projectAssignmentsId;
        this.role = role;
        this.users = users;
        this.projects = projects;
    }

    public UUID getProjectAssignmentsId() {
        return projectAssignmentsId;
    }

    public void setProjectAssignmentsId(UUID projectAssignmentsId) {
        this.projectAssignmentsId = projectAssignmentsId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Projects getProjects() {
        return projects;
    }

    public void setProjects(Projects projects) {
        this.projects = projects;
    }
}
