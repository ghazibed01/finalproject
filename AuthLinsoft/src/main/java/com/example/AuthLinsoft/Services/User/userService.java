package com.example.AuthLinsoft.Services.User;

import com.example.AuthLinsoft.Entities.ERole;
import com.example.AuthLinsoft.Entities.Role;
import com.example.AuthLinsoft.Entities.Status;
import com.example.AuthLinsoft.Entities.User;
import com.example.AuthLinsoft.Repositories.RoleRepository;
import com.example.AuthLinsoft.Repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class userService {
    @Autowired
    UserRepository repository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    PasswordEncoder encoder;

    // project manager
    public User createUser(String userJson, MultipartFile file) {
        try {
            User user = objectMapper.readValue(userJson, User.class);
            // Crypter le mot de passe avant de sauvegarder l'utilisateur
            String encodedPassword = encoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            if (file != null) {
                user.setImageName(file.getOriginalFilename());
                user.setImageType(file.getContentType());
                user.setImageData(file.getBytes());
            }
            Role role = roleRepository.findByName(ERole.Rh).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            user.getRoles().add(role);

            return repository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Error processing user data", e);
        }
    }
    // With Role Employee
    public User createEmployee(String userJson, MultipartFile file ) {
        try {
            User user = objectMapper.readValue(userJson, User.class);
            // Crypter le mot de passe avant de sauvegarder l'utilisateur
            String encodedPassword = encoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            if (file != null) {
                user.setImageName(file.getOriginalFilename());
                user.setImageType(file.getContentType());
                user.setImageData(file.getBytes());
            }
            Role role = roleRepository.findByName(ERole.Employe).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            user.getRoles().add(role);

            return repository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Error processing user data", e);
        }
    }
    public String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        Optional<User> optionalUser = repository.findById(userId);
        if (!optionalUser.isPresent()) {
            return "User not found";
        }

        User user = optionalUser.get();
        user.setImageName(file.getOriginalFilename());
        user.setImageType(file.getContentType());
        user.setImageData(file.getBytes());

       repository.save(user);
        return "Profile image uploaded successfully";
    }
    public List<User> getAllProjectManagers() {
        Role role = roleRepository.findByName(ERole.Rh)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        return repository.findByRoles(role);
    }
    public List<User> getAllEmployee() {
        Role role = roleRepository.findByName(ERole.Employe)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        return repository.findByRoles(role);
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

    public Optional<User> getUserById(Long id) {
        return repository.findById(id);
    }
    public User updateUser(Long id, User user) {
        Optional<User> optionalUser = repository.findById(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setUsername(user.getUsername());
            existingUser.setEmail(user.getEmail());
            existingUser.setGender(user.getGender());
            existingUser.setAddress(user.getAddress());
            existingUser.setDepartment(user.getDepartment());
            existingUser.setInformation(user.getInformation());
            existingUser.setMobile(user.getMobile());
            existingUser.setJoiningDate(user.getJoiningDate());

            // Update password if provided
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                String encodedPassword = encoder.encode(user.getPassword());
                existingUser.setPassword(encodedPassword);
            }

            return repository.save(existingUser);
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public void updatePassword(String username, String currentPassword, String newPassword) throws Exception {
        Optional<User> optionalUser =repository.findByUsername(username);
        if (!optionalUser.isPresent() || !encoder.matches(currentPassword, optionalUser.get().getPassword())) {
            throw new Exception("Invalid username or password");
        }
        User user = optionalUser.get();
        user.setPassword(encoder.encode(newPassword));
        repository.save(user);
    }
//update role
public User updateUserRoles(Long userId, Set<String> roleNames) {
    User user = repository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Vider les rôles actuels de l'utilisateur
    user.getRoles().clear();

    // Ajouter les nouveaux rôles
    Set<Role> roles = new HashSet<>();
    for (String roleName : roleNames) {
        ERole eRole;
        try {
            eRole = ERole.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role name: " + roleName);
        }

        Role role = roleRepository.findByName(eRole)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        roles.add(role);
    }
    user.setRoles(roles);

    return repository.save(user);
}
    public void saveUser(User user) {
        user.setStatus(Status.ONLINE);
        repository.save(user);
    }
    public void disconnect(User user) {
        var storedUser = repository.findByUsername(user.getUsername()).orElse(null);
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            repository.save(storedUser);
        }
    }
    public List<User> findUsersWithManagerOrRhRole() {
        return repository.findAll()
                .stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName() == ERole.Manager || role.getName() == ERole.Rh))
                .collect(Collectors.toList());
    }
    public List<User> findConnectedUsers() {
        return repository.findAllByStatus(Status.ONLINE);
    }
}
