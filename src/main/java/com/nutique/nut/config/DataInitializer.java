package com.nutique.nut.config;

import com.nutique.nut.Repository.AdminUserRepository;
import com.nutique.nut.model.AdminUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * On application startup, creates a default admin user if none exists yet.
 * Credentials come from app.admin.default-username / app.admin.default-password
 * (configurable via ADMIN_USERNAME / ADMIN_PASSWORD environment variables).
 *
 * IMPORTANT: change the default password after first login in production.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username}")
    private String defaultUsername;

    @Value("${app.admin.default-password}")
    private String defaultPassword;

    public DataInitializer(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminUserRepository.findByUsername(defaultUsername).isEmpty()) {
            AdminUser admin = new AdminUser(
                    defaultUsername,
                    passwordEncoder.encode(defaultPassword),
                    "Nutique Co Admin"
            );
            admin.setRole("ADMIN");
            adminUserRepository.save(admin);
            System.out.println("Created default admin user: " + defaultUsername);
        }
    }
}
