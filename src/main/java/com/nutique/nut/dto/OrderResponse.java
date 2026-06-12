package com.nutique.nut.dto;

import com.nutique.nut.model.Order;

/**
 * Response returned after an order is placed. Includes the saved order
 * plus a ready-to-send WhatsApp message and a wa.me link that the
 * frontend can open directly so the customer's order details are
 * pre-filled in WhatsApp.
 */
public class OrderResponse {

    private Order order;

    /** Pre-formatted order summary text for WhatsApp */
    private String whatsappMessage;

    /** Direct link: https://wa.me/<businessNumber>?text=<encoded message> */
    private String whatsappLink;

    public OrderResponse(Order order, String whatsappMessage, String whatsappLink) {
        this.order = order;
        this.whatsappMessage = whatsappMessage;
        this.whatsappLink = whatsappLink;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getWhatsappMessage() {
        return whatsappMessage;
    }

    public void setWhatsappMessage(String whatsappMessage) {
        this.whatsappMessage = whatsappMessage;
    }

    public String getWhatsappLink() {
        return whatsappLink;
    }

    public void setWhatsappLink(String whatsappLink) {
        this.whatsappLink = whatsappLink;
    }
}
