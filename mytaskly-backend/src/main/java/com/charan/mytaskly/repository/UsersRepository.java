package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, String> {

    Optional<Users> findByEmail(String username);

    @Query("SELECT u.email FROM Users u WHERE u.email!=:email")
    List<String> getAllUsersExceptUserIdMatch(@Param("email") String email);
}
