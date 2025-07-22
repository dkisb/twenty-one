package com.codecool.huszonegy.backend.service;


import com.codecool.huszonegy.backend.model.entity.Roles;
import com.codecool.huszonegy.backend.model.entity.UserEntity;
import com.codecool.huszonegy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService  {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findUserByName(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        List<SimpleGrantedAuthority> roles = new ArrayList<>();
        for (Roles role : userEntity.role()) {
            roles.add(new SimpleGrantedAuthority(role.name()));
        }

        return new User(userEntity.getUsername(), userEntity.getPassword(), userEntity.getRole());
    }

}
