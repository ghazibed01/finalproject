package com.example.AuthLinsoft.Repositories;


import com.example.AuthLinsoft.Entities.Role;
import com.example.AuthLinsoft.Entities.Status;
import com.example.AuthLinsoft.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
    List<User> findAllByStatus(Status status);
    List<User> findByRoles(Role role);
}