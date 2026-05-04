package com.nutique.nut.model;

/**
 * One line item within an order. Can represent either:
 * - A pre-built hamper purchased as-is (hamperId set, customItems empty)
 * - A custom hamper built by the customer (customItems populated)
 */
public class OrderItem {

    /** Type of this order line: "HAMPER" or "CUSTOM" */
    private String type;

    /** If type=HAMPER, reference to the Hamper purchased */
    private String hamperId;

    /** Display name shown in the order summary, e.g. "Mom's Pamper Box" or "Custom Hamper" */
    private String name;

    /** If type=CUSTOM, the list of chosen products */
    private java.util.List<HamperItem> customItems = new java.util.ArrayList<>();

    /** Box size chosen for a custom hamper, e.g. "small"/"medium"/"large" */
    private String boxSize;

    private int quantity = 1;

    /** Unit price at time of order (snapshot, so price changes later don't affect old orders) */
    private double unitPrice;

    /** Optional note from customer, e.g. gift message or special request */
    private String note;

    public OrderItem() {
    }

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

    public java.util.List<HamperItem> getCustomItems() {
        return customItems;
    }

    public void setCustomItems(java.util.List<HamperItem> customItems) {
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

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
