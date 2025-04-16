package com.charan.mytaskly.services;

import jakarta.mail.MessagingException;

public interface InvitationService {
    void sendInvitation(String email, String projectId) throws MessagingException;

    String respondToInvitation(String token, boolean response);
}
