package com.nutique.nut.controller;

import com.nutique.nut.Repository.CustomerRepository;
import com.nutique.nut.model.Customer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    /** GET /api/admin/customers - list of customers derived from orders */
    @GetMapping("/api/admin/customers")
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
    }
}
