package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.entities.Role;
import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UsersServiceImpl implements UsersService{

    private final UsersRepository usersRepository;

    private final PasswordEncoder passwordEncoder;

    public UsersServiceImpl(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public ResponseEntity<String> saveUser(UsersDto usersDto) {
        Optional<Users> existingUser = usersRepository.findByEmail(usersDto.getEmail());
        if(existingUser.isPresent()){
            return ResponseEntity.badRequest().body("Email is already in use.");
        }
        String hashPassword = passwordEncoder.encode(usersDto.getPassword());
        Users newUser = new Users();
        newUser.setUserId(UUID.randomUUID());
        newUser.setEmail(usersDto.getEmail());
        newUser.setName(usersDto.getName());
        newUser.setRole(Role.OWNER);
        newUser.setPassword(hashPassword);
        newUser.setImageUrl(usersDto.getImageUrl());

        usersRepository.save(newUser);
        return new ResponseEntity<String>("User added Successfully", HttpStatus.OK);
    }
}
