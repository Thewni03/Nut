package com.nutique.nut.controller;

import com.nutique.nut.model.Hamper;
import com.nutique.nut.model.Product;
import com.nutique.nut.Repository.HamperRepository;
import com.nutique.nut.Repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/images")
public class ImageController {

    private final ProductRepository productRepository;
    private final HamperRepository hamperRepository;

    public ImageController(ProductRepository productRepository, HamperRepository hamperRepository) {
        this.productRepository = productRepository;
        this.hamperRepository = hamperRepository;
    }

    /** Upload and attach image to a product */
    @PostMapping("/product/{id}")
    public ResponseEntity<Map<String, String>> uploadProductImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws IOException {

        String imageData = encodeImage(file);

        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Product product = opt.get();
        product.setImageUrl(imageData);
        productRepository.save(product);

        return ResponseEntity.ok(Map.of("imageUrl", imageData));
    }

    /** Upload and attach image to a hamper */
    @PostMapping("/hamper/{id}")
    public ResponseEntity<Map<String, String>> uploadHamperImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws IOException {

        String imageData = encodeImage(file);

        Optional<Hamper> opt = hamperRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Hamper hamper = opt.get();
        hamper.setImageUrl(imageData);
        hamperRepository.save(hamper);

        return ResponseEntity.ok(Map.of("imageUrl", imageData));
    }

    private String encodeImage(MultipartFile file) throws IOException {
        String contentType = file.getContentType() != null ? file.getContentType() : "image/jpeg";
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        return "data:" + contentType + ";base64," + base64;
    }
}