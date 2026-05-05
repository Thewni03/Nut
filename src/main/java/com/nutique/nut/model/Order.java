package com.nutique.nut.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a customer order. Created when a customer completes checkout
 * on the website. No online payment is processed - the order is recorded
 * here AND a formatted WhatsApp message is generated for the customer to
 * send, so Nutique Co can confirm payment and delivery manually.
 */
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    /**
     * Human-friendly order reference shown to customer and admin,
     * e.g. "NQ-20260612-0001"
     */
    @Indexed(unique = true)
    private String orderNumber;

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    private String customerEmail;

    /** Delivery address */
    private String deliveryAddress;

    /** City/area - useful for delivery cost estimation later */
    private String city;

    /** Requested delivery date (ISO date string, e.g. "2026-06-20") */
    private String deliveryDate;

    /** Items in this order */
    private List<OrderItem> items = new ArrayList<>();

    /** Total order value (sum of item subtotals) */
    private double totalAmount;

    /**
     * Order status workflow:
     * NEW -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
     * or CANCELLED at any point
     */
    @Indexed
    private String status = "NEW";

    /** General note from customer at checkout */
    private String customerNote;

    /** Internal note for admin/staff use */
    private String adminNote;

    /** Whether the WhatsApp order message has been sent by the customer */
    private boolean whatsappSent = false;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Order() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCustomerNote() {
        return customerNote;
    }

    public void setCustomerNote(String customerNote) {
        this.customerNote = customerNote;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }

    public boolean isWhatsappSent() {
        return whatsappSent;
    }

    public void setWhatsappSent(boolean whatsappSent) {
        this.whatsappSent = whatsappSent;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
