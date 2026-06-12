package com.nutique.nut.Repository;

import com.nutique.nut.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByCategory(String category);

    List<Product> findByActiveTrue();

    List<Product> findByActiveTrueAndAvailableForCustomBuilderTrue();

    List<Product> findByCategoryAndActiveTrue(String category);
}
