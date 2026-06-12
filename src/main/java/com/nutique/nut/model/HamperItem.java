package com.nutique.nut.model;

/**
 * Represents one line item inside a pre-built hamper.
 * Embedded directly inside the Hamper document - not a separate collection,
 * since hamper contents rarely need to be queried independently.
 */
public class HamperItem {

    /** Reference to the Product this line item is based on (optional - can be a free-text item) */
    private String productId;

    /** Display name of the item, e.g. "Scented Candle" */
    private String name;

    private int quantity = 1;

    public HamperItem() {
    }

    public HamperItem(String productId, String name, int quantity) {
        this.productId = productId;
        this.name = name;
        this.quantity = quantity;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
