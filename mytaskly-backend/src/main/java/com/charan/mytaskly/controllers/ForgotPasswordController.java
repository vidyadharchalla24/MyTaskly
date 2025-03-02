package com.charan.mytaskly.controllers;

import com.charan.mytaskly.services.UsersService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/forgot-password")
public class ForgotPasswordController {

    private final UsersService usersService;

    public ForgotPasswordController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) throws MessagingException {
        String response = usersService.forgotPassword(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        return ResponseEntity.ok(usersService.verifyOtp(email, otp));
    }

    @PostMapping("/set-password")
    public ResponseEntity<String> setPassword(@RequestParam String email, @RequestParam String newPassword) {
        return ResponseEntity.ok(usersService.setPassword(email, newPassword));
    }
}
