package com.charan.mytaskly.dto;

public class PaymentRequest {
    private Long amount;
    private String currency;

    public PaymentRequest(Long amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    public PaymentRequest() {
        super();
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
