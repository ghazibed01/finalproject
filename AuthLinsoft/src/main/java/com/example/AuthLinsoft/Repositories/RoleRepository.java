package com.example.AuthLinsoft.Repositories;


import com.example.AuthLinsoft.Entities.ERole;
import com.example.AuthLinsoft.Entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}