package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.SubscriptionsDto;
import com.charan.mytaskly.services.SubscriptionsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subscriptions")
public class SubscriptionsController {

    private final SubscriptionsService subscriptionsService;

    public SubscriptionsController(SubscriptionsService subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<SubscriptionsDto> getSubscriptionStatusByUserId(@PathVariable String userId){
        return ResponseEntity.ok(subscriptionsService.getSubscriptionStatusByUserId(userId));
    }

    @PutMapping("/update-subscription-plan/{userId}/{plan}")
    public ResponseEntity<String> updateSubscriptionPlanByUserIdAndPlan(@PathVariable("userId") String userId, @PathVariable("plan") String plan){
        return ResponseEntity.ok(subscriptionsService.updateSubscriptionPlanByUserIdAndPlan(userId,plan));
    }
}
