package com.nutique.nut.service;

import com.nutique.nut.Repository.HamperRepository;
import com.nutique.nut.exception.ResourceNotFoundException;
import com.nutique.nut.model.Hamper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class HamperService {

    private final HamperRepository hamperRepository;

    public HamperService(HamperRepository hamperRepository) {
        this.hamperRepository = hamperRepository;
    }

    /** Public: only active hampers, optionally filtered by occasion */
    public List<Hamper> getActiveHampers(String occasion) {
        if (occasion != null && !occasion.isBlank()) {
            return hamperRepository.findByOccasionAndActiveTrue(occasion);
        }
        return hamperRepository.findByActiveTrue();
    }

    public List<Hamper> getFeaturedHampers() {
        return hamperRepository.findByFeaturedTrueAndActiveTrue();
    }

    /** Admin: all hampers regardless of active status */
    public List<Hamper> getAllHampers() {
        return hamperRepository.findAll();
    }

    public Hamper getById(String id) {
        return hamperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hamper not found: " + id));
    }

    public Hamper create(Hamper hamper) {
        hamper.setCreatedAt(Instant.now());
        hamper.setUpdatedAt(Instant.now());
        return hamperRepository.save(hamper);
    }

    public Hamper update(String id, Hamper updated) {
        Hamper existing = getById(id);

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setOccasion(updated.getOccasion());
        existing.setTargetAudience(updated.getTargetAudience());
        existing.setItems(updated.getItems());
        existing.setPrice(updated.getPrice());
        existing.setEstimatedCost(updated.getEstimatedCost());
        existing.setBoxSize(updated.getBoxSize());
        existing.setImageUrl(updated.getImageUrl());
        existing.setActive(updated.isActive());
        existing.setFeatured(updated.isFeatured());
        existing.setUpdatedAt(Instant.now());

        return hamperRepository.save(existing);
    }

    public void delete(String id) {
        if (!hamperRepository.existsById(id)) {
            throw new ResourceNotFoundException("Hamper not found: " + id);
        }
        hamperRepository.deleteById(id);
    }

    public List<String> getOccasions() {
        return hamperRepository.findAll().stream()
                .map(Hamper::getOccasion)
                .filter(o -> o != null && !o.isBlank())
                .distinct()
                .sorted()
                .toList();
    }
}
