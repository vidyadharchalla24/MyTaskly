package com.charan.mytaskly.config;

import com.charan.mytaskly.entities.PlanType;
import com.charan.mytaskly.entities.SubscriptionPlan;
import com.charan.mytaskly.repository.SubscriptionPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public DataInitializer(SubscriptionPlanRepository subscriptionPlanRepository) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (subscriptionPlanRepository.count() == 0) { // Ensure we don't insert duplicates
            List<SubscriptionPlan> plans = Arrays.asList(
                    new SubscriptionPlan("SUB_FREE", PlanType.FREE,1,1,3,BigDecimal.valueOf(0.00),99999),
                    new SubscriptionPlan("SUB_PRO", PlanType.PRO,1,2,6,BigDecimal.valueOf(9.99),30),
                    new SubscriptionPlan("SUB_ADVANCED", PlanType.ADVANCED,2,4,12,BigDecimal.valueOf(19.99),30)
            );

            subscriptionPlanRepository.saveAll(plans);
            System.out.println("Subscription plans seeded successfully!");
        }
    }
}
