package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface InvitationRepository extends JpaRepository<Invitation,String> {

    @Query("SELECT i FROM Invitation i WHERE i.token = :token")
    Optional<Invitation> findByToken(@Param("token") String token);
}
