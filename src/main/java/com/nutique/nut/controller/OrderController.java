package com.nutique.nut.controller;

import com.nutique.nut.dto.OrderRequest;
import com.nutique.nut.dto.OrderResponse;
import com.nutique.nut.model.Order;
import com.nutique.nut.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ---- Public endpoint (customer checkout) ----

    /**
     * POST /api/orders - place an order from the customer site.
     * No payment is processed. The response includes a formatted
     * WhatsApp message and wa.me link for the customer to send.
     */
    @PostMapping("/api/orders")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.placeOrder(request);
        return ResponseEntity.ok(response);
    }

    // ---- Admin endpoints ----

    /** GET /api/admin/orders?status=NEW - list orders, optionally filtered by status */
    @GetMapping("/api/admin/orders")
    public List<Order> getOrders(@RequestParam(required = false) String status) {
        return orderService.getAllOrders(status);
    }

    @GetMapping("/api/admin/orders/{id}")
    public Order getOrder(@PathVariable String id) {
        return orderService.getById(id);
    }

    /** PATCH /api/admin/orders/{id}/status - body: {"status": "CONFIRMED", "adminNote": "..."} */
    @PatchMapping("/api/admin/orders/{id}/status")
    public Order updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return orderService.updateStatus(id, body.get("status"), body.get("adminNote"));
    }

    /** GET /api/admin/analytics - revenue, order counts, popular items */
    @GetMapping("/api/admin/analytics")
    public Map<String, Object> getAnalytics() {
        return orderService.getAnalytics();
    }
}
