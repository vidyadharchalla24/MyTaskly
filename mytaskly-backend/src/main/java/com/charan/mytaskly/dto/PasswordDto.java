package com.charan.mytaskly.dto;

import jakarta.validation.constraints.NotBlank;

public class PasswordDto {

    @NotBlank(message = "Password is required")
    private String oldPassword;

    @NotBlank(message = "Password is required")
    private String newPassword;

    public PasswordDto() {
        super();
    }

    public PasswordDto(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
