package com.charan.mytaskly.dto;

import com.charan.mytaskly.entities.ProjectStatus;
import com.charan.mytaskly.entities.Role;
import com.charan.mytaskly.entities.SubscriptionStatus;

public class AuthResponse {

    private String token;

    private SubscriptionStatus status;


    public AuthResponse(String token, SubscriptionStatus status) {
        this.token = token;
        this.status = status;
    }

    public AuthResponse() {
        super();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }
}
