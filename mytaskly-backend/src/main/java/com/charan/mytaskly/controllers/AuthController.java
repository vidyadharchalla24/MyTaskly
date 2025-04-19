package com.charan.mytaskly.controllers;

import com.charan.mytaskly.config.JwtTokenHelper;
import com.charan.mytaskly.dto.AuthRequest;
import com.charan.mytaskly.dto.AuthResponse;
import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.entities.ProjectStatus;
import com.charan.mytaskly.entities.SubscriptionStatus;
import com.charan.mytaskly.entities.Subscriptions;
import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.repository.ProjectAssignmentsRepository;
import com.charan.mytaskly.repository.SubscriptionsRepository;
import com.charan.mytaskly.repository.UsersRepository;
import com.charan.mytaskly.services.UsersService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final UserDetailsService userDetailsService;

    private final JwtTokenHelper jwtTokenHelper;

    private final AuthenticationManager authenticationManager;

    private final UsersService usersService;

    private final UsersRepository usersRepository;

    private final SubscriptionsRepository subscriptionsRepository;

    public AuthController(UserDetailsService userDetailsService, JwtTokenHelper jwtTokenHelper, AuthenticationManager authenticationManager, UsersService usersService, UsersRepository usersRepository, SubscriptionsRepository subscriptionsRepository) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenHelper = jwtTokenHelper;
        this.authenticationManager = authenticationManager;
        this.usersService = usersService;
        this.usersRepository = usersRepository;
        this.subscriptionsRepository = subscriptionsRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> createToken(@Valid @RequestBody AuthRequest authRequest)throws ResourceNotFoundException,BadCredentialsException {
        try {
            Authentication authentication = new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword());
            authenticationManager.authenticate(authentication); // This will throw BadCredentialsException if credentials are incorrect

            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
            String token = jwtTokenHelper.generateToken(userDetails);

            Users users = usersRepository.findByEmail(authRequest.getEmail()).orElseThrow(
                    ()-> new ResourceNotFoundException("User Not Found")
            );

            Subscriptions subscriptions = subscriptionsRepository.getSubscriptionsByUserId(users.getUserId());
            
            AuthResponse authResponse = new AuthResponse(token,subscriptions.getStatus());

            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Invalid email or password", SubscriptionStatus.valueOf("")));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UsersDto usersDto){
        return usersService.saveUser(usersDto);
    }

}
