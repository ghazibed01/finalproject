package com.example.AuthLinsoft.Repositories;

import com.example.AuthLinsoft.Entities.ValidationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;
@Repository

public interface ValidationTokenRepository extends JpaRepository<ValidationToken, Integer> {
    Optional<ValidationToken> findByToken(String token);
}

