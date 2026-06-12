package com.nutique.nut.service;

import com.nutique.nut.Repository.CustomerRepository;
import com.nutique.nut.Repository.HamperRepository;
import com.nutique.nut.Repository.OrderRepository;
import com.nutique.nut.Repository.ProductRepository;
import com.nutique.nut.dto.OrderItemRequest;
import com.nutique.nut.dto.OrderRequest;
import com.nutique.nut.dto.OrderResponse;
import com.nutique.nut.exception.BadRequestException;
import com.nutique.nut.exception.ResourceNotFoundException;
import com.nutique.nut.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final HamperRepository hamperRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    /** WhatsApp business number in international format, no plus sign, e.g. 947XXXXXXXX */
    @Value("${app.whatsapp.business-number:94762245460}")
    private String whatsappBusinessNumber;

    private static final DateTimeFormatter ORDER_NUMBER_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMdd").withZone(ZoneOffset.UTC);

    public OrderService(OrderRepository orderRepository,
                        HamperRepository hamperRepository,
                        ProductRepository productRepository,
                        CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.hamperRepository = hamperRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    /**
     * Places an order:
     * 1. Validates and prices each item (hampers and custom builds)
     * 2. Saves the order with status NEW
     * 3. Creates or updates the Customer record
     * 4. Generates a formatted WhatsApp message + wa.me link
     */
    public OrderResponse placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCity(request.getCity());
        order.setDeliveryDate(request.getDeliveryDate());
        order.setCustomerNote(request.getCustomerNote());
        order.setStatus("NEW");
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemReq : request.getItems()) {
            OrderItem orderItem = buildOrderItem(itemReq);
            orderItems.add(orderItem);
            total += orderItem.getUnitPrice() * orderItem.getQuantity();
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        upsertCustomer(saved);

        String message = buildWhatsAppMessage(saved);
        String link = buildWhatsAppLink(message);

        return new OrderResponse(saved, message, link);
    }

    private OrderItem buildOrderItem(OrderItemRequest req) {
        OrderItem item = new OrderItem();
        item.setType(req.getType());
        item.setQuantity(req.getQuantity());
        item.setNote(req.getNote());

        if ("HAMPER".equalsIgnoreCase(req.getType())) {
            if (req.getHamperId() == null || req.getHamperId().isBlank()) {
                throw new BadRequestException("hamperId is required for HAMPER order items");
            }
            Hamper hamper = hamperRepository.findById(req.getHamperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hamper not found: " + req.getHamperId()));

            item.setHamperId(hamper.getId());
            item.setName(hamper.getName());
            item.setBoxSize(hamper.getBoxSize());
            item.setUnitPrice(hamper.getPrice());
            item.setCustomItems(hamper.getItems());

        } else if ("CUSTOM".equalsIgnoreCase(req.getType())) {
            if (req.getCustomItems() == null || req.getCustomItems().isEmpty()) {
                throw new BadRequestException("customItems must not be empty for CUSTOM order items");
            }

            item.setName(req.getName() != null && !req.getName().isBlank() ? req.getName() : "Custom Hamper");
            item.setBoxSize(req.getBoxSize());

            List<HamperItem> resolvedItems = new ArrayList<>();
            double customTotal = 0;

            for (OrderItemRequest.CustomItemRequest customItemReq : req.getCustomItems()) {
                Product product = productRepository.findById(customItemReq.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + customItemReq.getProductId()));

                resolvedItems.add(new HamperItem(product.getId(), product.getName(), customItemReq.getQuantity()));
                customTotal += product.getSellingPrice() * customItemReq.getQuantity();
            }

            item.setCustomItems(resolvedItems);
            item.setUnitPrice(customTotal);

        } else {
            throw new BadRequestException("Invalid order item type: " + req.getType() + " (expected HAMPER or CUSTOM)");
        }

        return item;
    }

    private String generateOrderNumber() {
        String datePart = ORDER_NUMBER_DATE_FORMAT.format(Instant.now());
        long countToday = orderRepository.count() + 1;
        return String.format("NQ-%s-%04d", datePart, countToday);
    }

    private void upsertCustomer(Order order) {
        Customer customer = customerRepository.findByPhone(order.getCustomerPhone())
                .orElseGet(() -> {
                    Customer c = new Customer();
                    c.setPhone(order.getCustomerPhone());
                    c.setFirstOrderAt(Instant.now());
                    return c;
                });

        customer.setName(order.getCustomerName());
        customer.setEmail(order.getCustomerEmail());
        customer.setCity(order.getCity());
        customer.setTotalOrders(customer.getTotalOrders() + 1);
        customer.setTotalSpent(customer.getTotalSpent() + order.getTotalAmount());
        customer.setLastOrderAt(Instant.now());

        customerRepository.save(customer);
    }

    /**
     * Builds a human-readable order summary that the customer can send
     * via WhatsApp to confirm their order.
     */
    private String buildWhatsAppMessage(Order order) {
        StringBuilder sb = new StringBuilder();

        sb.append("Hello Nutique Co! I would like to place the following order:\n\n");
        sb.append("Order Ref: ").append(order.getOrderNumber()).append("\n");
        sb.append("Name: ").append(order.getCustomerName()).append("\n");
        sb.append("Phone: ").append(order.getCustomerPhone()).append("\n");

        if (order.getCity() != null && !order.getCity().isBlank()) {
            sb.append("City: ").append(order.getCity()).append("\n");
        }
        sb.append("Delivery Address: ").append(order.getDeliveryAddress()).append("\n");

        if (order.getDeliveryDate() != null && !order.getDeliveryDate().isBlank()) {
            sb.append("Preferred Delivery Date: ").append(order.getDeliveryDate()).append("\n");
        }

        sb.append("\n--- Items ---\n");

        for (OrderItem item : order.getItems()) {
            sb.append("\n* ").append(item.getName());
            if (item.getQuantity() > 1) {
                sb.append(" x").append(item.getQuantity());
            }
            if (item.getBoxSize() != null && !item.getBoxSize().isBlank()) {
                sb.append(" (").append(item.getBoxSize()).append(" box)");
            }
            sb.append(" - Rs. ").append(formatPrice(item.getUnitPrice() * item.getQuantity()));

            if (item.getCustomItems() != null && !item.getCustomItems().isEmpty()) {
                sb.append("\n  Contents:");
                for (HamperItem hi : item.getCustomItems()) {
                    sb.append("\n   - ").append(hi.getName());
                    if (hi.getQuantity() > 1) {
                        sb.append(" x").append(hi.getQuantity());
                    }
                }
            }

            if (item.getNote() != null && !item.getNote().isBlank()) {
                sb.append("\n  Note: ").append(item.getNote());
            }
        }

        sb.append("\n\n--- Total: Rs. ").append(formatPrice(order.getTotalAmount())).append(" ---\n");

        if (order.getCustomerNote() != null && !order.getCustomerNote().isBlank()) {
            sb.append("\nAdditional note: ").append(order.getCustomerNote()).append("\n");
        }

        sb.append("\nPlease confirm my order. Thank you!");

        return sb.toString();
    }

    private String buildWhatsAppLink(String message) {
        String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return "https://wa.me/" + whatsappBusinessNumber + "?text=" + encoded;
    }

    private String formatPrice(double price) {
        if (price == Math.floor(price)) {
            return String.format("%,.0f", price);
        }
        return String.format("%,.2f", price);
    }

    // ---- Admin operations ----

    public List<Order> getAllOrders(String status) {
        if (status != null && !status.isBlank()) {
            return orderRepository.findByStatus(status);
        }
        return orderRepository.findAll();
    }

    public Order getById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    public Order updateStatus(String id, String status, String adminNote) {
        Order order = getById(id);
        order.setStatus(status);
        if (adminNote != null) {
            order.setAdminNote(adminNote);
        }
        order.setUpdatedAt(Instant.now());
        return orderRepository.save(order);
    }

    /** Basic analytics: revenue, order counts by status, popular hampers/occasions */
    public Map<String, Object> getAnalytics() {
        List<Order> allOrders = orderRepository.findAll();

        double totalRevenue = allOrders.stream().mapToDouble(Order::getTotalAmount).sum();
        long totalOrders = allOrders.size();

        Map<String, Long> ordersByStatus = new HashMap<>();
        for (Order o : allOrders) {
            ordersByStatus.merge(o.getStatus(), 1L, Long::sum);
        }

        Map<String, Integer> hamperPopularity = new HashMap<>();
        Map<String, Double> hamperRevenue = new HashMap<>();
        for (Order o : allOrders) {
            for (OrderItem item : o.getItems()) {
                hamperPopularity.merge(item.getName(), item.getQuantity(), Integer::sum);
                hamperRevenue.merge(item.getName(), item.getUnitPrice() * item.getQuantity(), Double::sum);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("totalOrders", totalOrders);
        result.put("ordersByStatus", ordersByStatus);
        result.put("itemPopularity", hamperPopularity);
        result.put("itemRevenue", hamperRevenue);
        result.put("totalCustomers", customerRepository.count());

        return result;
    }
}
