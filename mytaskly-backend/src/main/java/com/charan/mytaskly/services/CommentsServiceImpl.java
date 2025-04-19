package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.CommentDto;
import com.charan.mytaskly.entities.Comments;
import com.charan.mytaskly.entities.Issues;
import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.repository.CommentsRepository;
import com.charan.mytaskly.repository.IssuesRepository;
import com.charan.mytaskly.repository.UsersRepository;
import com.charan.mytaskly.utils.CloudinaryUtilities;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentsServiceImpl implements CommentsService {

    private final CommentsRepository commentsRepository;

    private final IssuesRepository issuesRepository;

    private final UsersRepository usersRepository;

    private final ImageUploadCloudinary imageUploadCloudinary;

    private final CloudinaryUtilities cloudinaryUtilities;

    public CommentsServiceImpl(CommentsRepository commentsRepository, IssuesRepository issuesRepository, UsersRepository usersRepository, ImageUploadCloudinary imageUploadCloudinary, CloudinaryUtilities cloudinaryUtilities) {
        this.commentsRepository = commentsRepository;
        this.issuesRepository = issuesRepository;
        this.usersRepository = usersRepository;
        this.imageUploadCloudinary = imageUploadCloudinary;
        this.cloudinaryUtilities = cloudinaryUtilities;
    }

    @Override
    public String addComments(String issueId, String userId, String content, MultipartFile file) throws IOException {
        Issues issues = issuesRepository.findById(issueId).orElseThrow(
                () -> new ResourceNotFoundException("Issue not found")
        );
        Users users = usersRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found")
        );

        String commentId = UUID.randomUUID().toString();
        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            fileUrl = imageUploadCloudinary.uploadImage(file);
        }
        Comments comments = new Comments(commentId, content, fileUrl, issues, users);

        commentsRepository.save(comments);
        return "Comment added successfully!!";
    }

    @Override
    public List<CommentDto> getAllCommentsByIssueId(String issueId) {
        List<Comments> commentsList = commentsRepository.getAllCommentsByIssueId(issueId);
        return commentsList.stream().map((comment) -> new CommentDto(comment.getCommentId(),
                        comment.getContent(),
                        comment.getFileUrl(),
                        comment.getIssues().getIssueId(),
                        comment.getUsers().getUserId(),
                        comment.getUsers().getName(),
                        comment.getUsers().getImageUrl()))
                .collect(Collectors.toList());
    }

    @Override
    public String deleteCommentByCommentId(String commentId) throws IOException {
        Comments comments = commentsRepository.findById(commentId).orElseThrow(
                ()-> new ResourceNotFoundException("Comment not found!!")
        );
        cloudinaryUtilities.deleteImageFromCloudinary(comments.getFileUrl());
        commentsRepository.delete(comments);
        return "Comment deleted successfully!!";
    }
}
