package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.SubscriptionsDto;
import com.charan.mytaskly.entities.SubscriptionPlan;
import com.charan.mytaskly.entities.SubscriptionStatus;
import com.charan.mytaskly.entities.Subscriptions;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.repository.SubscriptionPlanRepository;
import com.charan.mytaskly.repository.SubscriptionsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;

@Service
public class SubscriptionsServiceImpl implements SubscriptionsService{

    private final SubscriptionsRepository subscriptionsRepository;

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public SubscriptionsServiceImpl(SubscriptionsRepository subscriptionsRepository, SubscriptionPlanRepository subscriptionPlanRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    @Override
    public SubscriptionsDto getSubscriptionStatusByUserId(String userId) {
        Subscriptions subscriptions = subscriptionsRepository.getSubscriptionsByUserId(userId);
        return new SubscriptionsDto(subscriptions.getPlan().getSubscriptionPlanId(),subscriptions.getStatus());
    }

    @Override
    public String updateSubscriptionPlanByUserIdAndPlan(String userId, String plan) {
        SubscriptionPlan subscriptionPlan = subscriptionPlanRepository.findById(plan).orElseThrow(
                () -> new ResourceNotFoundException("Subscription plan not found!!")
        );

        Subscriptions subscriptions = subscriptionsRepository.getSubscriptionsByUserId(userId);

        LocalDate currentDate = LocalDate.now();
        LocalDate endDate;

        if (plan.equalsIgnoreCase("SUB_PRO") || plan.equalsIgnoreCase("SUB_ADVANCED")) {
            endDate = currentDate.plusDays(30);
        } else if (plan.equalsIgnoreCase("SUB_FREE")) {
            endDate = currentDate.plusDays(99999);
        } else {
            throw new IllegalArgumentException("Invalid subscription plan type");
        }

        subscriptions.setPlan(subscriptionPlan);
        subscriptions.setStatus(SubscriptionStatus.ACTIVE);
        subscriptions.setStartDate(currentDate);
        subscriptions.setEndDate(endDate);

        subscriptionsRepository.save(subscriptions);
        return "Thanks for upgrading your plan.";
    }

}
