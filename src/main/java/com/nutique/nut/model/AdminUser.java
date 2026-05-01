package com.nutique.nut.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents an admin/staff user who can log in to the admin dashboard.
 * Passwords are stored BCrypt-hashed, never in plain text.
 */
@Document(collection = "admin_users")
public class AdminUser {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    /** BCrypt-hashed password */
    private String password;

    private String fullName;

    /** Role - currently only "ADMIN", but kept flexible for future staff roles */
    private String role = "ADMIN";

    public AdminUser() {
    }

    public AdminUser(String username, String password, String fullName) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
