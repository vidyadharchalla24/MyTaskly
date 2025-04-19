package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentsRepository extends JpaRepository<Comments,String> {
    @Query("SELECT cm FROM Comments cm WHERE cm.issues.issueId=:issueId")
    List<Comments> getAllCommentsByIssueId(@Param("issueId") String issueId);
}
