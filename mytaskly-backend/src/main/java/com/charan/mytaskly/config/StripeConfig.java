package com.charan.mytaskly.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class StripeConfig {

    private final Environment environment;

    public StripeConfig(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void init() {
        String apiKey = environment.getProperty("STRIPE_SECRET_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("STRIPE_SECRET_KEY is not set in environment!");
        }
        Stripe.apiKey = apiKey;
    }
}
