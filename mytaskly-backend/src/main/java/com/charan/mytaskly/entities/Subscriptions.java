package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
public class Subscriptions {

    @Id
    @Column(name = "subscriptions_id")
    private String subscriptionsId;

    private LocalDate startDate;

    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "subscription-owner")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    @JsonBackReference(value = "subscription-plan")
    private SubscriptionPlan plan;

    public Subscriptions() {
        super();
    }

    public Subscriptions(String subscriptionsId, LocalDate startDate, LocalDate endDate, SubscriptionStatus status, Users user, SubscriptionPlan plan) {
        this.subscriptionsId = subscriptionsId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.user = user;
        this.plan = plan;
    }

    public String getSubscriptionsId() {
        return subscriptionsId;
    }

    public void setSubscriptionsId(String subscriptionsId) {
        this.subscriptionsId = subscriptionsId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public SubscriptionPlan getPlan() {
        return plan;
    }

    public void setPlan(SubscriptionPlan plan) {
        this.plan = plan;
    }
}
