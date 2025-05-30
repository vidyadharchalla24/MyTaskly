package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comments {

    @Id
    @Column(name = "comment_id")
    private String commentId;

    @Column(nullable = false)
    private String Content;

    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    @JsonBackReference
    private Issues issues;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "users-comments")
    private Users users;

    public Comments(String commentId, String content, String fileUrl, Issues issues, Users users) {
        this.commentId = commentId;
        Content = content;
        this.fileUrl = fileUrl;
        this.issues = issues;
        this.users = users;
    }

    public Comments() {
        super();
    }

    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
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
