package com.charan.mytaskly.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;

    private final JwtTokenHelper jwtTokenHelper;

    private String jwtToken;

    private String userName;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtTokenHelper jwtTokenHelper) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenHelper = jwtTokenHelper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestToken = request.getHeader("Authorization");
        if(requestToken!=null && requestToken.startsWith("Bearer")){
            jwtToken = requestToken.substring(7);
            try{
                userName = jwtTokenHelper.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException  e) {
                throw new RuntimeException(e);
            } catch (ExpiredJwtException eje) {
                throw new IllegalArgumentException("v");
            }catch (MalformedJwtException mje){
                throw new MalformedJwtException("e");
            }
        }else{
            System.out.println("jwt token doesn't begin with bearer");
        }

        if(userName!=null && SecurityContextHolder.getContext().getAuthentication() ==null){
            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

            if (jwtTokenHelper.validateToken(jwtToken,userDetails)) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(userName,null, AuthorityUtils.commaSeparatedStringToAuthorityList(userDetails.getAuthorities().toString()));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }else{
                throw new BadCredentialsException("Invalid Jwt token!");
            }
        }else{
            System.out.println("no Username or context is not null");
        }
        filterChain.doFilter(request,response);
    }
}
