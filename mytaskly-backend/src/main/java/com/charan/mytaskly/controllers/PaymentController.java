package com.charan.mytaskly.controllers;

import com.charan.mytaskly.dto.PaymentRequest;
import com.charan.mytaskly.dto.PaymentResponse;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponse> createPaymentIntent(@RequestBody PaymentRequest request) {
        PaymentResponse response = new PaymentResponse();

        try {
            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setAmount(request.getAmount())
                            .setCurrency(request.getCurrency())
                            .setAutomaticPaymentMethods(
                                    PaymentIntentCreateParams.AutomaticPaymentMethods
                                            .builder()
                                            .setEnabled(true)
                                            .build())
                            .build();

            PaymentIntent intent = PaymentIntent.create(params);
            response.setClientSecret(intent.getClientSecret());
            response.setSuccess(true);

        } catch (Exception e) {
            response.setSuccess(false);
            System.err.println("Error creating payment intent: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
