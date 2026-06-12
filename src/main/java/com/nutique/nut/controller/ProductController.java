package com.nutique.nut.controller;

import com.nutique.nut.model.Product;
import com.nutique.nut.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ---- Public endpoints (customer site) ----

    /** GET /api/products?category=Food%20%26%20Beverages - active products, optionally filtered */
    @GetMapping("/api/products")
    public List<Product> getProducts(@RequestParam(required = false) String category) {
        return productService.getActiveProducts(category);
    }

    /** GET /api/products/custom-builder - items selectable in the custom hamper builder */
    @GetMapping("/api/products/custom-builder")
    public List<Product> getCustomBuilderProducts() {
        return productService.getCustomBuilderProducts();
    }

    /** GET /api/products/categories - list of distinct categories */
    @GetMapping("/api/products/categories")
    public List<String> getCategories() {
        return productService.getCategories();
    }

    /** GET /api/products/{id} - single product detail */
    @GetMapping("/api/products/{id}")
    public Product getProduct(@PathVariable String id) {
        return productService.getById(id);
    }

    // ---- Admin endpoints ----

    /** GET /api/admin/products - all products including inactive */
    @GetMapping("/api/admin/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/api/admin/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product created = productService.create(product);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/api/admin/products/{id}")
    public Product updateProduct(@PathVariable String id, @Valid @RequestBody Product product) {
        return productService.update(id, product);
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
