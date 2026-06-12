package com.nutique.nut.Repository;

import com.nutique.nut.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByStatus(String status);

    List<Order> findByCustomerPhone(String customerPhone);

    List<Order> findByOrderNumber(String orderNumber);

    List<Order> findByCreatedAtBetween(Instant start, Instant end);

    long countByStatus(String status);
}
