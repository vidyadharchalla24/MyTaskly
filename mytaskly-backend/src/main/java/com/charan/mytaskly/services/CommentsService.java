package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.CommentDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CommentsService {
    String addComments(String issueId, String userId, String content, MultipartFile file)throws IOException;

    List<CommentDto> getAllCommentsByIssueId(String issueId);

    String deleteCommentByCommentId(String commentId) throws IOException;
}
