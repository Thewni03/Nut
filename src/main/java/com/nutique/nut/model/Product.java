package com.nutique.nut.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
/**
 * Represents an individual item/product that can be added to a hamper
 * either as part of a pre-built hamper, or chosen by a customer in the
 * custom hamper builder.

 * Categories correspond to the "Item List" sheet:
 * Food & Beverages, Personal Care & Wellness, Home & Lifestyle,
 * Stationery & Office, Gift & Keepsake Items, Seasonal & Festive Items,
 * Corporate & Executive Gifts, Children's Items
 */
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    @Indexed
    private String category;

    /** Cost price - what Nutique Co pays for this item (internal use) */
    @PositiveOrZero
    private double costPrice;

    /** Selling price - shown to customers when used in custom builder */
    @PositiveOrZero
    private double sellingPrice;

    /** Current stock count - optional, can be left null if not tracked */
    private Integer stockQuantity;

    /** URL to product image */
    private String imageUrl;

    /** Whether this item is currently available for selection */
    private boolean active = true;

    /** Whether this item can be selected in the custom hamper builder */
    private boolean availableForCustomBuilder = true;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Product() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(double costPrice) {
        this.costPrice = costPrice;
    }

    public double getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isAvailableForCustomBuilder() {
        return availableForCustomBuilder;
    }

    public void setAvailableForCustomBuilder(boolean availableForCustomBuilder) {
        this.availableForCustomBuilder = availableForCustomBuilder;
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
