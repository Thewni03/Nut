package com.nutique.nut.Repository;

import com.nutique.nut.model.Hamper;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HamperRepository extends MongoRepository<Hamper, String> {

    List<Hamper> findByActiveTrue();

    List<Hamper> findByOccasionAndActiveTrue(String occasion);

    List<Hamper> findByFeaturedTrueAndActiveTrue();

    List<Hamper> findByOccasion(String occasion);
}
