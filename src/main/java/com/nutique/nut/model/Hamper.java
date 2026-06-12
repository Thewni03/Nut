package com.nutique.nut.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a pre-built hamper, e.g. "Mom's Pamper Box" for Mother's Day,
 * or "Avurudu Special Pack". Corresponds to the combinations described in
 * Sheet5, "Special Days", "Item List" (Popular Combinations) and Sheet3
 * (Occasion -> Suggested Items).
 */
@Document(collection = "hampers")
public class Hamper {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String description;

    /**
     * Occasion this hamper is designed for, e.g. "Birthday", "Anniversary",
     * "Mother's Day", "Avurudu", "Christmas", "Corporate".
     */
    @Indexed
    private String occasion;

    /**
     * Target audience, e.g. "Mom", "Dad", "Girlfriend", "Boyfriend", "Kids",
     * "Corporate". Helps the customer filter.
     */
    private String targetAudience;

    /** Items included in this hamper */
    private List<HamperItem> items = new ArrayList<>();

    /** Selling price shown to the customer */
    @PositiveOrZero
    private double price;

    /** Estimated cost price (60% rule from Special Days sheet) - admin only */
    @PositiveOrZero
    private double estimatedCost;

    /** Box size: small / medium / large */
    private String boxSize;

    /** URL to a representative photo */
    private String imageUrl;

    /** Whether this hamper is shown on the customer site */
    private boolean active = true;

    /** Whether this hamper is featured on the homepage */
    private boolean featured = false;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public Hamper() {
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

    public String getOccasion() {
        return occasion;
    }

    public void setOccasion(String occasion) {
        this.occasion = occasion;
    }

    public String getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(String targetAudience) {
        this.targetAudience = targetAudience;
    }

    public List<HamperItem> getItems() {
        return items;
    }

    public void setItems(List<HamperItem> items) {
        this.items = items;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getBoxSize() {
        return boxSize;
    }

    public void setBoxSize(String boxSize) {
        this.boxSize = boxSize;
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

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
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
