package com.nutique.nut.controller;

import com.nutique.nut.model.Hamper;
import com.nutique.nut.service.HamperService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HamperController {

    private final HamperService hamperService;

    public HamperController(HamperService hamperService) {
        this.hamperService = hamperService;
    }

    // ---- Public endpoints (customer site) ----

    /** GET /api/hampers?occasion=Birthday - active hampers, optionally filtered by occasion */
    @GetMapping("/api/hampers")
    public List<Hamper> getHampers(@RequestParam(required = false) String occasion) {
        return hamperService.getActiveHampers(occasion);
    }

    /** GET /api/hampers/featured - featured hampers for homepage */
    @GetMapping("/api/hampers/featured")
    public List<Hamper> getFeaturedHampers() {
        return hamperService.getFeaturedHampers();
    }

    /** GET /api/occasions - list of distinct occasions */
    @GetMapping("/api/occasions")
    public List<String> getOccasions() {
        return hamperService.getOccasions();
    }

    /** GET /api/hampers/{id} - single hamper detail */
    @GetMapping("/api/hampers/{id}")
    public Hamper getHamper(@PathVariable String id) {
        return hamperService.getById(id);
    }

    // ---- Admin endpoints ----

    /** GET /api/admin/hampers - all hampers including inactive */
    @GetMapping("/api/admin/hampers")
    public List<Hamper> getAllHampers() {
        return hamperService.getAllHampers();
    }

    @PostMapping("/api/admin/hampers")
    public ResponseEntity<Hamper> createHamper(@Valid @RequestBody Hamper hamper) {
        Hamper created = hamperService.create(hamper);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/api/admin/hampers/{id}")
    public Hamper updateHamper(@PathVariable String id, @Valid @RequestBody Hamper hamper) {
        return hamperService.update(id, hamper);
    }

    @DeleteMapping("/api/admin/hampers/{id}")
    public ResponseEntity<Void> deleteHamper(@PathVariable String id) {
        hamperService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
