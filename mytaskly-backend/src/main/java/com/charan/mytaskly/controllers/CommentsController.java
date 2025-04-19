package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.CommentDto;
import com.charan.mytaskly.services.CommentsService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentsController {

    private final CommentsService commentsService;

    public CommentsController(CommentsService commentsService) {
        this.commentsService = commentsService;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<String> addComments(@RequestParam("issueId") String issueId,
                                       @RequestParam("userId") String userId,
                                       @RequestParam("content") String content,
                                       @RequestPart(value = "file", required = false) MultipartFile file)throws IOException {
        return ResponseEntity.ok(commentsService.addComments(issueId,userId,content,file));
    }

    @GetMapping("/all-comments/{issueId}")
    public ResponseEntity<List<CommentDto>> getAllCommentsByIssueId(@PathVariable String issueId){
        return ResponseEntity.ok(commentsService.getAllCommentsByIssueId(issueId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteCommentByCommentId(@PathVariable String commentId) throws IOException {
        return ResponseEntity.ok(commentsService.deleteCommentByCommentId(commentId));
    }

}
