package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.SubscriptionsDto;

public interface SubscriptionsService {
    SubscriptionsDto getSubscriptionStatusByUserId(String userId);

    String updateSubscriptionPlanByUserIdAndPlan(String userId, String plan);
}
