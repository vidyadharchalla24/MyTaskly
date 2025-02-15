package com.charan.mytaskly.dto;

public class AuthResponse {

    private String token;

    public AuthResponse() {
        super();
    }

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
