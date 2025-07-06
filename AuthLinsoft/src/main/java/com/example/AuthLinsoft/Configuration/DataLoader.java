package com.example.AuthLinsoft.Configuration;

import com.example.AuthLinsoft.Entities.ERole;
import com.example.AuthLinsoft.Entities.Role;
import com.example.AuthLinsoft.Entities.Status;
import com.example.AuthLinsoft.Entities.User;
import com.example.AuthLinsoft.Repositories.RoleRepository;
import com.example.AuthLinsoft.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Vérifier si le rôle Manager existe déjà
        List<Role> existingRoles = roleRepository.findAll();
        Role managerRole = existingRoles.stream()
                .filter(r -> r.getName() == ERole.Manager)
                .findFirst()
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(ERole.Manager);
                    return roleRepository.save(newRole);
                });

        // Vérifier si un utilisateur avec le username "manager" existe
        if (userRepository.existsByUsername("manager")) {
            System.out.println("ℹ L'utilisateur manager existe déjà.");
            return;
        }

        // Créer le nouvel utilisateur manager
        User manager = new User();
        manager.setUsername("manager");
        manager.setEmail("manager@example.com");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setStatus(Status.ONLINE);
        manager.setEnabled(true);
        manager.setDepartment("Direction");
        manager.setGender("Homme");

        Set<Role> roles = new HashSet<>();
        roles.add(managerRole);
        manager.setRoles(roles);

        userRepository.save(manager);

        System.out.println("✔ Utilisateur Manager ajouté avec succès.");
    }
}
