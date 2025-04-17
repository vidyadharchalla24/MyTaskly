package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.PasswordDto;
import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.entities.Users;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UsersService {

    ResponseEntity<String> saveUser(@Valid UsersDto usersDto);

    String uploadProfileImage(String userId, MultipartFile file) throws IOException;

    String removeProfileImage(String userId) throws IOException;

    String updateUserPassword(String userId, PasswordDto passwordDto);

    String forgotPassword(String email) throws MessagingException;

    String verifyOtp(String email, String otp);

    String setPassword(String email, String newPassword);

    String updateUsername(String email, String username);

    Users getUserByUserId(String userId);

    String deleteUserByUserId(String userId);

    List<Users> getAllUsers();

    List<String> getAllUsersExceptUserIdMatch(String email);
}
