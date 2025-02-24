package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.PasswordDto;
import com.charan.mytaskly.services.UsersService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping(value = "/{userId}/upload", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadProfileImage(@PathVariable String userId, @RequestParam("file") MultipartFile file)  {
        try{
            if (file.isEmpty()){
                return ResponseEntity.badRequest().body("File is empty. Please upload a valid image.");
            }
            String message = usersService.uploadProfileImage(userId,file);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error uploading image: " + e.getMessage());
        }
    }

    @DeleteMapping(value = "/{userId}/remove")
    public ResponseEntity<String> removeProfileImage(@PathVariable String userId)  {
        try{
            String message = usersService.removeProfileImage(userId);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error removing image: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}/changePassword")
    public ResponseEntity<String> updateUserPassword(@PathVariable("userId") String userId,@Valid @RequestBody PasswordDto passwordDto){
        String message = usersService.updateUserPassword(userId,passwordDto);
        return ResponseEntity.ok(message);
    }

}
