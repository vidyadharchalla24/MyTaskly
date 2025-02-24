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
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            String response = usersService.forgotPassword(email);
            return ResponseEntity.ok(response);
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Error sending OTP email.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        String response = usersService.verifyOtp(email, otp);
        if (response.equals("OTP has been successfully verified.")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/set-password")
    public ResponseEntity<String> setPassword(@RequestParam String email, @RequestParam String newPassword) {
        try {
            String response = usersService.setPassword(email, newPassword);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
