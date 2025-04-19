package com.charan.mytaskly.dto;

import com.charan.mytaskly.entities.SubscriptionStatus;

public class SubscriptionsDto
{
    private String planId;

    private SubscriptionStatus status;

    public SubscriptionsDto(String planId, SubscriptionStatus status) {
        this.planId = planId;
        this.status = status;
    }

    public SubscriptionsDto() {
        super();
    }

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }
}
