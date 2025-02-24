package com.charan.mytaskly.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;

@Entity
public class OneTimePassword {

    @Id
    private String id;

    private String otpValue;

    private LocalDateTime expirationTime;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users users;

    public OneTimePassword() {
        super();
    }

    public OneTimePassword(String id, String otpValue, LocalDateTime expirationTime, Users users) {
        this.id = id;
        this.otpValue = otpValue;
        this.expirationTime = expirationTime;
        this.users = users;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOtpValue() {
        return otpValue;
    }

    public void setOtpValue(String otpValue) {
        this.otpValue = otpValue;
    }

    public LocalDateTime getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(LocalDateTime expirationTime) {
        this.expirationTime = expirationTime;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }
}
