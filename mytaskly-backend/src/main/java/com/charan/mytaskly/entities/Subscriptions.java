package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
public class Subscriptions {

    @Id
    @Column(name = "subscriptions_id")
    private UUID subscriptionsId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private Users user;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    @JsonBackReference
    private SubscriptionPlan plan;

    public Subscriptions() {
        super();
    }

    public Subscriptions(UUID subscriptionsId, Date startDate, Date endDate, SubscriptionStatus status, Users user, SubscriptionPlan plan) {
        this.subscriptionsId = subscriptionsId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.user = user;
        this.plan = plan;
    }

    public UUID getSubscriptionsId() {
        return subscriptionsId;
    }

    public void setSubscriptionsId(UUID subscriptionsId) {
        this.subscriptionsId = subscriptionsId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
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
