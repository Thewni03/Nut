package com.nutique.nut.service;

import com.nutique.nut.Repository.ProductRepository;
import com.nutique.nut.exception.ResourceNotFoundException;
import com.nutique.nut.model.Product;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /** Public: only active products, optionally filtered by category */
    public List<Product> getActiveProducts(String category) {
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategoryAndActiveTrue(category);
        }
        return productRepository.findByActiveTrue();
    }

    /** Public: active products available for the custom hamper builder */
    public List<Product> getCustomBuilderProducts() {
        return productRepository.findByActiveTrueAndAvailableForCustomBuilderTrue();
    }

    /** Admin: all products regardless of active status */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public Product create(Product product) {
        product.setCreatedAt(Instant.now());
        product.setUpdatedAt(Instant.now());
        return productRepository.save(product);
    }

    public Product update(String id, Product updated) {
        Product existing = getById(id);

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setCostPrice(updated.getCostPrice());
        existing.setSellingPrice(updated.getSellingPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setImageUrl(updated.getImageUrl());
        existing.setActive(updated.isActive());
        existing.setAvailableForCustomBuilder(updated.isAvailableForCustomBuilder());
        existing.setUpdatedAt(Instant.now());

        return productRepository.save(existing);
    }

    public void delete(String id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<String> getCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .distinct()
                .sorted()
                .toList();
    }
}
