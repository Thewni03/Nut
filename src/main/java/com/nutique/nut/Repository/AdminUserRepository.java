package com.nutique.nut.Repository;

import com.nutique.nut.model.AdminUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminUserRepository extends MongoRepository<AdminUser, String> {

    Optional<AdminUser> findByUsername(String username);
}
