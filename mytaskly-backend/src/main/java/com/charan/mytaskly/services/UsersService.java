package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.UsersDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

public interface UsersService {

    ResponseEntity<String> saveUser(@Valid UsersDto usersDto);
}
