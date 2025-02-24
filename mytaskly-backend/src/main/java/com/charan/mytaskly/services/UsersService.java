package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.UsersDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UsersService {

    ResponseEntity<String> saveUser(@Valid UsersDto usersDto);

    String uploadProfileImage(String userId, MultipartFile file) throws IOException;

    String removeProfileImage(String userId) throws IOException;
}
