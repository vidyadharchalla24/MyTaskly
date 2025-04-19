package com.charan.mytaskly.dto;

public class CommentDto {

    private String commentId;

    private String Content;

    private String fileUrl;

    private String issueId;

    private String userId;

    private String name;

    private String imageUrl;

    public CommentDto(String commentId, String content, String fileUrl, String issueId, String userId, String name, String imageUrl) {
        this.commentId = commentId;
        Content = content;
        this.fileUrl = fileUrl;
        this.issueId = issueId;
        this.userId = userId;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public CommentDto() {
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

    public String getIssueId() {
        return issueId;
    }

    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
