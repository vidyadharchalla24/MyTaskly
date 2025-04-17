package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.PasswordDto;
import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.services.UsersService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping(value = "/{userId}/upload", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadProfileImage(@PathVariable String userId, @RequestParam("file") MultipartFile file) throws IOException {
        String message = usersService.uploadProfileImage(userId,file);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping(value = "/{userId}/remove")
    public ResponseEntity<String> removeProfileImage(@PathVariable String userId) throws IOException {
        String message = usersService.removeProfileImage(userId);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/{userId}/changePassword")
    public ResponseEntity<String> updateUserPassword(@PathVariable("userId") String userId,@Valid @RequestBody PasswordDto passwordDto){
        String message = usersService.updateUserPassword(userId,passwordDto);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{email}/changeUsername")
    public ResponseEntity<String> updateUsername(@PathVariable("email") String email,@RequestParam String username){
        return ResponseEntity.ok(usersService.updateUsername(email,username));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Users> getUserByUserId(@PathVariable("userId") String userId){
        return ResponseEntity.ok(usersService.getUserByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Users>> getAllUsers(){
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUserByUserId(@PathVariable("userId") String userId){
        return ResponseEntity.ok(usersService.deleteUserByUserId(userId));
    }

    @GetMapping("all-users/{email}")
    public ResponseEntity<List<String>> getAllUsersExceptUserIdMatch(@PathVariable String email){
        return ResponseEntity.ok(usersService.getAllUsersExceptUserIdMatch(email));
    }

}
