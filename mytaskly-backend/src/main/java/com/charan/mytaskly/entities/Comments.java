package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "comments")
public class Comments {

    @Id
    @Column(name = "comment_id")
    private UUID commentId;

    @Column(nullable = false)
    private String Content;

    @ManyToOne
    @JoinColumn(name = "issue_id",nullable = false)
    @JsonBackReference
    private Issues issues;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    public Comments() {
        super();
    }

    public Comments(UUID commentId, String content, Issues issues, Users users) {
        this.commentId = commentId;
        Content = content;
        this.issues = issues;
        this.users = users;
    }

    public UUID getCommentId() {
        return commentId;
    }

    public void setCommentId(UUID commentId) {
        this.commentId = commentId;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
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
