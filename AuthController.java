package com.smartcomplaint.controller;

import com.smartcomplaint.dto.Dtos.*;
import com.smartcomplaint.entity.User;
import com.smartcomplaint.repository.UserRepository;
import com.smartcomplaint.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        if (newUser.getRole() == null) newUser.setRole(User.Role.CUSTOMER);
        User saved = userRepository.save(newUser);
        return ResponseEntity.ok(saved);
    }
}
