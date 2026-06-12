package com.nutique.nut.config;

import com.nutique.nut.Repository.HamperRepository;
import com.nutique.nut.Repository.ProductRepository;
import com.nutique.nut.model.Hamper;
import com.nutique.nut.model.HamperItem;
import com.nutique.nut.model.Product;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the database with an initial catalogue of products and sample
 * hampers based on Nutique Co's planning spreadsheet (Item List, Sheet3,
 * Sheet5). Runs once on startup if the products collection is empty -
 * safe to leave in place, it will not duplicate data on later restarts.

 * This is STARTER data - the admin dashboard should be used to add real
 * products with actual prices, descriptions and photos. Selling prices
 * here are rough placeholders following the 60% cost / 40% markup
 * guidance from the "Special Days" sheet and should be reviewed.
 */
@Component
@Order(2)
public class SeedDataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final HamperRepository hamperRepository;

    public SeedDataLoader(ProductRepository productRepository, HamperRepository hamperRepository) {
        this.productRepository = productRepository;
        this.hamperRepository = hamperRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            seedProducts();
            System.out.println("Seeded product catalogue (" + productRepository.count() + " items)");
        }

        if (hamperRepository.count() == 0) {
            seedHampers();
            System.out.println("Seeded sample hampers (" + hamperRepository.count() + " hampers)");
        }
    }

    private Product product(String name, String category, double cost, double sell) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setCostPrice(cost);
        p.setSellingPrice(sell);
        p.setActive(true);
        p.setAvailableForCustomBuilder(true);
        return p;
    }

    private void seedProducts() {
        List<Product> products = new ArrayList<>();

        // --- Food & Beverages ---
        String foodCat = "Food & Beverages";
        products.add(product("Premium tea assortment", foodCat, 800, 1300));
        products.add(product("Gourmet coffee bottle", foodCat, 1200, 1900));
        products.add(product("Hot chocolate mix", foodCat, 600, 1000));
        products.add(product("Herbal tea collection", foodCat, 700, 1150));
        products.add(product("Chocolate box (Kandos)", foodCat, 900, 1500));
        products.add(product("Assorted cookies", foodCat, 500, 850));
        products.add(product("Luxury biscuits", foodCat, 600, 1000));
        products.add(product("Fruit cake", foodCat, 1000, 1650));
        products.add(product("Mixed nuts", foodCat, 700, 1150));
        products.add(product("Dried fruits", foodCat, 750, 1250));
        products.add(product("Honey jar", foodCat, 600, 1000));
        products.add(product("Jam or preserves", foodCat, 450, 750));
        products.add(product("Granola bars", foodCat, 500, 850));
        products.add(product("Gourmet popcorn", foodCat, 400, 700));
        products.add(product("Candy assortment", foodCat, 400, 700));
        products.add(product("Brownies", foodCat, 550, 900));
        products.add(product("Macarons", foodCat, 900, 1500));
        products.add(product("Gourmet crackers", foodCat, 500, 850));
        products.add(product("Cheese (Kraft/Happycow/Kothmale)", foodCat, 600, 1000));
        products.add(product("Fruit basket", foodCat, 1500, 2500));
        products.add(product("Dates", foodCat, 500, 850));
        products.add(product("Cashews", foodCat, 700, 1150));
        products.add(product("Pringles", foodCat, 450, 750));
        products.add(product("Kithul hakuru", foodCat, 350, 600));
        products.add(product("Arrack bottle", foodCat, 1800, 2800));
        products.add(product("Champagne / wine bottle", foodCat, 2500, 3800));

        // --- Personal Care & Wellness ---
        String careCat = "Personal Care & Wellness";
        products.add(product("Scented candle", careCat, 500, 850));
        products.add(product("Essential oil set", careCat, 1200, 1900));
        products.add(product("Bath salts", careCat, 500, 850));
        products.add(product("Hand cream (Spa Ceylon)", careCat, 600, 1000));
        products.add(product("Body lotion (Spa Ceylon)", careCat, 800, 1300));
        products.add(product("Lip balm (Spa Ceylon)", careCat, 350, 600));
        products.add(product("Face masks (Spa Ceylon)", careCat, 400, 700));
        products.add(product("Hand sanitizer", careCat, 300, 500));
        products.add(product("Aromatherapy diffuser", careCat, 1800, 2800));
        products.add(product("Sleep mask", careCat, 400, 700));
        products.add(product("Bath bomb set", careCat, 600, 1000));
        products.add(product("Face serum", careCat, 1200, 1900));
        products.add(product("Hand wash", careCat, 400, 700));
        products.add(product("Body scrub", careCat, 700, 1150));
        products.add(product("Wellness journal", careCat, 600, 1000));
        products.add(product("Face wash kit (Spa Ceylon)", careCat, 1200, 1900));
        products.add(product("Grooming set", careCat, 1500, 2400));
        products.add(product("Shaving kit", careCat, 1200, 1900));
        products.add(product("Shampoo (men)", careCat, 500, 850));
        products.add(product("Body spray", careCat, 700, 1150));
        products.add(product("Mouth wash", careCat, 450, 750));
        products.add(product("Makeup blush set", careCat, 900, 1500));
        products.add(product("Nail kit", careCat, 700, 1150));
        products.add(product("Nail polish", careCat, 350, 600));

        // --- Home & Lifestyle ---
        String homeCat = "Home & Lifestyle";
        products.add(product("Ceramic mug", homeCat, 400, 700));
        products.add(product("Insulated tumbler", homeCat, 1200, 1900));
        products.add(product("Water bottle", homeCat, 800, 1300));
        products.add(product("Decorative coaster set", homeCat, 500, 850));
        products.add(product("Small indoor plant", homeCat, 400, 700));
        products.add(product("Photo frame", homeCat, 500, 850));
        products.add(product("Desk organizer", homeCat, 900, 1500));
        products.add(product("Key holder", homeCat, 450, 750));
        products.add(product("Mini clock", homeCat, 700, 1150));
        products.add(product("Decorative cushion cover", homeCat, 700, 1150));
        products.add(product("Decorative vase", homeCat, 900, 1500));
        products.add(product("Table lamp", homeCat, 1800, 2800));
        products.add(product("Wooden serving board", homeCat, 1200, 1900));
        products.add(product("Bed sheet set", homeCat, 2500, 3900));
        products.add(product("Pillow cases", homeCat, 800, 1300));
        products.add(product("Kitchen utensil set (spoons, forks, spatula)", homeCat, 900, 1500));
        products.add(product("Spice jars (Thunapaha)", homeCat, 700, 1150));
        products.add(product("Cup set", homeCat, 800, 1300));
        products.add(product("Oven gloves (mittens)", homeCat, 450, 750));
        products.add(product("Oven dishes", homeCat, 1200, 1900));
        products.add(product("Flower vase", homeCat, 700, 1150));
        products.add(product("Towels", homeCat, 800, 1300));
        products.add(product("Table mats", homeCat, 700, 1150));
        products.add(product("Tote bag", homeCat, 600, 1000));
        products.add(product("Tumbler", homeCat, 700, 1150));
        products.add(product("Throw blanket", homeCat, 1800, 2800));
        products.add(product("Frother", homeCat, 600, 1000));
        products.add(product("Porcelain mug", homeCat, 600, 1000));
        products.add(product("Wine glasses (pair)", homeCat, 1500, 2400));
        products.add(product("Small umbrella", homeCat, 700, 1150));

        // --- Stationery & Office ---
        String stationeryCat = "Stationery & Office";
        products.add(product("Premium notebook (Timeplan)", stationeryCat, 600, 1000));
        products.add(product("Planner / diary", stationeryCat, 700, 1150));
        products.add(product("Sticky notes set", stationeryCat, 300, 500));
        products.add(product("Luxury pen", stationeryCat, 500, 850));
        products.add(product("Bookmark set", stationeryCat, 250, 450));
        products.add(product("Desk calendar", stationeryCat, 450, 750));
        products.add(product("Nice pen set", stationeryCat, 700, 1150));
        products.add(product("Mini journal", stationeryCat, 450, 750));
        products.add(product("Cute notebook", stationeryCat, 450, 750));

        // --- Gift & Keepsake Items ---
        String giftCat = "Gift & Keepsake Items";
        products.add(product("Customized greeting card", giftCat, 200, 400));
        products.add(product("Fridge magnet", giftCat, 250, 450));
        products.add(product("Mini soft toy", giftCat, 500, 850));
        products.add(product("Inspirational quote plaque", giftCat, 600, 1000));
        products.add(product("Memory journal", giftCat, 600, 1000));
        products.add(product("Engraved keychain", giftCat, 400, 700));
        products.add(product("Mini wallet", giftCat, 700, 1150));
        products.add(product("Wallet", giftCat, 1200, 1900));
        products.add(product("Belt", giftCat, 1200, 1900));
        products.add(product("Tie", giftCat, 1000, 1600));
        products.add(product("Mini purse", giftCat, 800, 1300));
        products.add(product("Organizer purse set", giftCat, 1200, 1900));
        products.add(product("Small jewellery piece", giftCat, 900, 1500));
        products.add(product("Earrings", giftCat, 700, 1150));
        products.add(product("Bracelet", giftCat, 700, 1150));
        products.add(product("Claw clip", giftCat, 250, 450));
        products.add(product("Hair pins", giftCat, 200, 400));
        products.add(product("Sunglasses (shades)", giftCat, 1200, 1900));

        // --- Seasonal & Festive Items ---
        String festiveCat = "Seasonal & Festive Items";
        products.add(product("Christmas ornament", festiveCat, 350, 600));
        products.add(product("New Year celebration kit", festiveCat, 1200, 1900));
        products.add(product("Gift voucher / shopping coupon", festiveCat, 1000, 1000));
        products.add(product("Christmas socks", festiveCat, 400, 700));
        products.add(product("Christmas mugs", festiveCat, 600, 1000));
        products.add(product("Christmas bows", festiveCat, 200, 400));
        products.add(product("Poinsettia flower (decor)", festiveCat, 500, 850));
        products.add(product("Kiri uthurana pot", festiveCat, 1500, 2400));
        products.add(product("Mati pahan with matchbox and pahan thira", festiveCat, 900, 1500));
        products.add(product("Betel leaves and arecanut set", festiveCat, 400, 700));
        products.add(product("Oil lamp", festiveCat, 800, 1300));

        // --- Corporate & Executive Gifts ---
        String corporateCat = "Corporate & Executive Gifts";
        products.add(product("Leather notebook", corporateCat, 1500, 2400));
        products.add(product("Executive pen", corporateCat, 900, 1500));
        products.add(product("Business card holder", corporateCat, 700, 1150));

        // --- Children's Items ---
        String kidsCat = "Children's Items";
        products.add(product("Story book", kidsCat, 500, 850));
        products.add(product("Building blocks set", kidsCat, 900, 1500));
        products.add(product("Coloring pencils", kidsCat, 400, 700));
        products.add(product("Educational game", kidsCat, 800, 1300));
        products.add(product("Plush toy", kidsCat, 700, 1150));
        products.add(product("Picture coloring book", kidsCat, 350, 600));
        products.add(product("Soft toy (large)", kidsCat, 900, 1500));
        products.add(product("Sticker cards set", kidsCat, 250, 450));
        products.add(product("Small toy car", kidsCat, 350, 600));
        products.add(product("Rubik's cube", kidsCat, 450, 750));
        products.add(product("Puzzle set", kidsCat, 600, 1000));
        products.add(product("Graduation teddy bear", kidsCat, 900, 1500));

        productRepository.saveAll(products);
    }

    /**
     * Finds a product by (approximate) name from the just-seeded catalogue.
     * Used to build hamper item lists with real productId references.
     */
    private Product find(List<Product> all, String name) {
        return all.stream()
                .filter(p -> p.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }

    private void seedHampers() {
        List<Product> all = productRepository.findAll();
        List<Hamper> hampers = new ArrayList<>();

        // --- Mother's Day hamper ---
        Hamper momHamper = new Hamper();
        momHamper.setName("Mom's pamper box");
        momHamper.setDescription("A relaxing self-care hamper with tea, candle and skincare essentials.");
        momHamper.setOccasion("Mother's Day");
        momHamper.setTargetAudience("Mom");
        momHamper.setBoxSize("medium");
        momHamper.setPrice(5500);
        momHamper.setEstimatedCost(3300);
        momHamper.setFeatured(true);
        momHamper.setItems(hamperItems(all,
                "Scented candle",
                "Premium tea assortment",
                "Hand cream (Spa Ceylon)",
                "Face masks (Spa Ceylon)",
                "Mini journal"
        ));
        hampers.add(momHamper);

        // --- Father's Day hamper ---
        Hamper dadHamper = new Hamper();
        dadHamper.setName("Dad's coffee and snacks box");
        dadHamper.setDescription("Coffee, snacks and a tumbler for the coffee-loving dad.");
        dadHamper.setOccasion("Father's Day");
        dadHamper.setTargetAudience("Dad");
        dadHamper.setBoxSize("medium");
        dadHamper.setPrice(5000);
        dadHamper.setEstimatedCost(3000);
        dadHamper.setFeatured(true);
        dadHamper.setItems(hamperItems(all,
                "Gourmet coffee bottle",
                "Insulated tumbler",
                "Premium notebook (Timeplan)",
                "Mixed nuts",
                "Luxury pen"
        ));
        hampers.add(dadHamper);

        // --- Couple / Girlfriend hamper for Valentine's Day ---
        Hamper coupleHamper = new Hamper();
        coupleHamper.setName("Sweetheart surprise box");
        coupleHamper.setDescription("Chocolates, candle and skincare treats for someone special.");
        coupleHamper.setOccasion("Valentine's Day");
        coupleHamper.setTargetAudience("Girlfriend/Wife");
        coupleHamper.setBoxSize("medium");
        coupleHamper.setPrice(6000);
        coupleHamper.setEstimatedCost(3600);
        coupleHamper.setFeatured(true);
        coupleHamper.setItems(hamperItems(all,
                "Chocolate box (Kandos)",
                "Scented candle",
                "Body lotion (Spa Ceylon)",
                "Small indoor plant",
                "Customized greeting card"
        ));
        hampers.add(coupleHamper);

        // --- Boyfriend hamper ---
        Hamper bfHamper = new Hamper();
        bfHamper.setName("For him gift box");
        bfHamper.setDescription("Chocolates, coffee and grooming essentials.");
        bfHamper.setOccasion("Valentine's Day");
        bfHamper.setTargetAudience("Boyfriend/Husband");
        bfHamper.setBoxSize("medium");
        bfHamper.setPrice(5500);
        bfHamper.setEstimatedCost(3300);
        bfHamper.setItems(hamperItems(all,
                "Chocolate box (Kandos)",
                "Gourmet coffee bottle",
                "Mixed nuts",
                "Body spray",
                "Customized greeting card"
        ));
        hampers.add(bfHamper);

        // --- Graduation hamper ---
        Hamper gradHamper = new Hamper();
        gradHamper.setName("Graduation achievement box");
        gradHamper.setDescription("Celebrate their achievement with a planner, pen and treats.");
        gradHamper.setOccasion("Graduation");
        gradHamper.setBoxSize("medium");
        gradHamper.setPrice(4800);
        gradHamper.setEstimatedCost(2900);
        gradHamper.setItems(hamperItems(all,
                "Graduation teddy bear",
                "Nice pen set",
                "Mini journal",
                "Chocolate box (Kandos)",
                "Customized greeting card"
        ));
        hampers.add(gradHamper);

        // --- Avurudu hamper ---
        Hamper avuruduHamper = new Hamper();
        avuruduHamper.setName("Avurudu special pack");
        avuruduHamper.setDescription("Traditional treats and decor for Sinhala and Tamil New Year.");
        avuruduHamper.setOccasion("Avurudu");
        avuruduHamper.setBoxSize("large");
        avuruduHamper.setPrice(6500);
        avuruduHamper.setEstimatedCost(3900);
        avuruduHamper.setFeatured(true);
        avuruduHamper.setItems(hamperItems(all,
                "Kithul hakuru",
                "Mati pahan with matchbox and pahan thira",
                "Premium tea assortment",
                "Oil lamp",
                "Betel leaves and arecanut set"
        ));
        hampers.add(avuruduHamper);

        // --- Kids hamper ---
        Hamper kidsHamper = new Hamper();
        kidsHamper.setName("Little explorer fun box");
        kidsHamper.setDescription("Toys, books and treats to bring a smile to a child's face.");
        kidsHamper.setOccasion("Children's Day");
        kidsHamper.setBoxSize("medium");
        kidsHamper.setPrice(4500);
        kidsHamper.setEstimatedCost(2700);
        kidsHamper.setItems(hamperItems(all,
                "Plush toy",
                "Story book",
                "Coloring pencils",
                "Picture coloring book",
                "Candy assortment"
        ));
        hampers.add(kidsHamper);

        // --- Christmas hamper ---
        Hamper christmasHamper = new Hamper();
        christmasHamper.setName("Christmas joy hamper");
        christmasHamper.setDescription("Festive treats, candles and decorations for the holiday season.");
        christmasHamper.setOccasion("Christmas");
        christmasHamper.setBoxSize("large");
        christmasHamper.setPrice(7000);
        christmasHamper.setEstimatedCost(4200);
        christmasHamper.setFeatured(true);
        christmasHamper.setItems(hamperItems(all,
                "Christmas ornament",
                "Fruit cake",
                "Hot chocolate mix",
                "Scented candle",
                "Assorted cookies"
        ));
        hampers.add(christmasHamper);

        // --- Corporate hamper ---
        Hamper corporateHamper = new Hamper();
        corporateHamper.setName("Client appreciation hamper");
        corporateHamper.setDescription("A professional gift hamper suited for clients and colleagues.");
        corporateHamper.setOccasion("Corporate");
        corporateHamper.setBoxSize("large");
        corporateHamper.setPrice(8000);
        corporateHamper.setEstimatedCost(4800);
        corporateHamper.setItems(hamperItems(all,
                "Leather notebook",
                "Executive pen",
                "Gourmet coffee bottle",
                "Chocolate box (Kandos)",
                "Business card holder"
        ));
        hampers.add(corporateHamper);

        hamperRepository.saveAll(hampers);
    }

    private List<HamperItem> hamperItems(List<Product> all, String... names) {
        List<HamperItem> items = new ArrayList<>();
        for (String name : names) {
            Product p = find(all, name);
            if (p != null) {
                items.add(new HamperItem(p.getId(), p.getName(), 1));
            } else {
                // Fallback - item not found in catalogue, still add by name
                items.add(new HamperItem(null, name, 1));
            }
        }
        return items;
    }
}
