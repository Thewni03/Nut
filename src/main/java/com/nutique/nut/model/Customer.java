package com.nutique.nut.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Represents a customer, created or updated automatically whenever an
 * order is placed with a phone number that hasn't been seen before.
 * Lets the admin dashboard show a customer list and basic repeat-purchase
 * stats without the customer needing to register an account.
 */
@Document(collection = "customers")
public class Customer {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String phone;

    private String email;

    private String city;

    /** Total number of orders placed */
    private int totalOrders = 0;

    /** Total amount spent across all orders */
    private double totalSpent = 0;

    private Instant firstOrderAt = Instant.now();
    private Instant lastOrderAt = Instant.now();

    public Customer() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Instant getFirstOrderAt() {
        return firstOrderAt;
    }

    public void setFirstOrderAt(Instant firstOrderAt) {
        this.firstOrderAt = firstOrderAt;
    }

    public Instant getLastOrderAt() {
        return lastOrderAt;
    }

    public void setLastOrderAt(Instant lastOrderAt) {
        this.lastOrderAt = lastOrderAt;
    }
}
