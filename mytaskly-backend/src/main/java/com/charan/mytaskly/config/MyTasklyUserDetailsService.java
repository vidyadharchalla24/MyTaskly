package com.charan.mytaskly.config;

import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.repository.UsersRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MyTasklyUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    public MyTasklyUserDetailsService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users userDetails = usersRepository.findByEmail(username).orElseThrow(
                ()-> new UsernameNotFoundException("User does not exist.")
        );

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(userDetails.getRole().toString()));
        return new User(userDetails.getEmail(),userDetails.getPassword(),authorities);
    }

}
