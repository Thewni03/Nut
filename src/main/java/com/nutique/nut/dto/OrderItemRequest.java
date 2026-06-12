package com.nutique.nut.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload for one item in an order - either a pre-built hamper
 * or a custom-built hamper.
 */
public class OrderItemRequest {

    /** "HAMPER" or "CUSTOM" */
    @NotBlank
    private String type;

    /** Required if type=HAMPER */
    private String hamperId;

    /** Display name - required if type=CUSTOM (e.g. "My Custom Hamper") */
    private String name;

    /** Required if type=CUSTOM: list of {productId, quantity} */
    @Valid
    private List<CustomItemRequest> customItems = new ArrayList<>();

    /** Box size for custom hampers */
    private String boxSize;

    @Min(1)
    private int quantity = 1;

    private String note;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getHamperId() {
        return hamperId;
    }

    public void setHamperId(String hamperId) {
        this.hamperId = hamperId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CustomItemRequest> getCustomItems() {
        return customItems;
    }

    public void setCustomItems(List<CustomItemRequest> customItems) {
        this.customItems = customItems;
    }

    public String getBoxSize() {
        return boxSize;
    }

    public void setBoxSize(String boxSize) {
        this.boxSize = boxSize;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public static class CustomItemRequest {
        @NotBlank
        private String productId;

        @Min(1)
        private int quantity = 1;

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
