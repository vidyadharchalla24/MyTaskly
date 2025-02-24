package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.OneTimePassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OneTimePasswordRepository extends JpaRepository<OneTimePassword,String> {

    @Query("SELECT o FROM OneTimePassword o WHERE o.users.id = :userId")
    OneTimePassword getOtpByUserId(@Param("userId") String userId);

}
