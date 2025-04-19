package com.charan.mytaskly.dto;

public class PaymentResponse {
    private String clientSecret;
    private boolean success;

    // Getters and setters
    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}