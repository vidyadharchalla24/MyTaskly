package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.UUID;


@Entity
@Table(name = "attachments")
public class Attachments {

    @Id
    @Column(name = "attachment_id")
    private UUID attachmentId;

    @Column(nullable = false)
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    @JsonBackReference
    private Issues issues;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private Users users;

    public Attachments() {
        super();
    }

    public Attachments(UUID attachmentId, String fileUrl, Issues issues, Users users) {
        this.attachmentId = attachmentId;
        this.fileUrl = fileUrl;
        this.issues = issues;
        this.users = users;
    }

    public UUID getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(UUID attachmentId) {
        this.attachmentId = attachmentId;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Issues getIssues() {
        return issues;
    }

    public void setIssues(Issues issues) {
        this.issues = issues;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }
}
