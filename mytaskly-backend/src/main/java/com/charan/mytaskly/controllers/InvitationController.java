package com.charan.mytaskly.controllers;

import com.charan.mytaskly.services.InvitationService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invitations")
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @PostMapping("/send/{email}/{projectId}")
    public ResponseEntity<String> sendInvitation(@PathVariable("email") String email, @PathVariable("projectId") String projectId) throws MessagingException {
        invitationService.sendInvitation(email, projectId);
        return ResponseEntity.ok("Invitation sent successfully");
    }

    @PostMapping("/respond")
    public ResponseEntity<String> respondToInvitation(@RequestParam String token, @RequestParam boolean response) {
        String message = invitationService.respondToInvitation(token, response);
        return ResponseEntity.ok(message);
    }
}
