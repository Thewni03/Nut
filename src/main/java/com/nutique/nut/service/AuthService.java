package com.nutique.nut.service;

import com.nutique.nut.Repository.AdminUserRepository;
import com.nutique.nut.Security.JwtUtil;
import com.nutique.nut.dto.LoginRequest;
import com.nutique.nut.dto.LoginResponse;
import com.nutique.nut.model.AdminUser;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        AdminUser user = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new LoginResponse(token, user.getUsername(), user.getFullName(), user.getRole());
    }
}
