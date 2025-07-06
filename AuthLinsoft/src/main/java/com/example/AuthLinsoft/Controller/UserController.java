package com.example.AuthLinsoft.Controller;

import com.example.AuthLinsoft.DTO.PasswordUpdateRequest;
import com.example.AuthLinsoft.Entities.EmailTemplateName;
import com.example.AuthLinsoft.Entities.Role;
import com.example.AuthLinsoft.Entities.User;
import com.example.AuthLinsoft.Entities.ValidationToken;
import com.example.AuthLinsoft.Repositories.UserRepository;
import com.example.AuthLinsoft.Repositories.ValidationTokenRepository;
import com.example.AuthLinsoft.Services.EmailService;
import com.example.AuthLinsoft.Services.User.userService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import javax.mail.MessagingException;
import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@RequiredArgsConstructor
public class UserController {
    private final com.example.AuthLinsoft.Services.User.userService userService;
    @Autowired
    UserRepository userRepository;
    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;
    @Autowired
    ValidationTokenRepository validationTokenRepository ;
    @Autowired
    EmailService emailService ;
    @Autowired
    private ObjectMapper objectMapper;
    @GetMapping("/Allusers")

    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String username) {
        try {

            List<User> users = new ArrayList<>();

            if (username == null)
                users.addAll(userRepository.findAll());
            else
                userRepository.findByUsername(username).ifPresent(users::add);

            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{userId}/roles")
    public ResponseEntity<Set<Role>> getUserRoles(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            Set<Role> roles = user.get().getRoles();  // Get the User object and then call getRoles()
            return ResponseEntity.ok(roles);
        } else {
            return ResponseEntity.notFound().build();  // Return 404 if the user is not found
        }
    }
    @PutMapping("/{userId}/roles/{roleNames}")
    public ResponseEntity<User> updateUserRoles(
            @PathVariable Long userId,
            @PathVariable String roleNames) {
        Set<String> roleNamesSet = Stream.of(roleNames.split(","))
                .collect(Collectors.toSet());
        User updatedUser = userService.updateUserRoles(userId, roleNamesSet);
        return ResponseEntity.ok(updatedUser);
    }
    @GetMapping("/userUsername/{username}")

    public ResponseEntity<User> getUserByUsrname(@PathVariable("username") String username) {
        Optional<User> userData = userRepository.findByUsername(username);

        return userData.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
//create user with role  PM
    @PostMapping("/Cuser")
    public ResponseEntity<User> createUser(@RequestParam("user") String userJson,
                                           @RequestParam(value = "file", required = false) MultipartFile file) throws MessagingException, JsonProcessingException {
            User user1 = objectMapper.readValue(userJson, User.class);
            String Password = user1.getPassword();
            System.out.println("password"+Password);
            User createdUser = userService.createUser(userJson, file);
            sendValidationEmail(createdUser ,Password);
            return ResponseEntity.ok(createdUser);
    }

    //create user with role  Employee
    @PostMapping("/Cemployee")
    public ResponseEntity<User> createEmployee(@RequestParam("employee") String userJson,
                                           @RequestParam(value = "image", required = false) MultipartFile file) throws MessagingException, JsonProcessingException {
            User user1 = objectMapper.readValue(userJson, User.class);
            String Password = user1.getPassword();
            System.out.println("password"+Password);
            User createdUser = userService.createEmployee(userJson, file);
            sendValidationEmail(createdUser,Password);
        return ResponseEntity.ok(createdUser);
    }
    @GetMapping("/project-managers")
    public ResponseEntity<List<User>> getAllProjectManagers() {
        List<User> projectManagers = userService.getAllProjectManagers();
        return ResponseEntity.ok(projectManagers);
    }
    @GetMapping("/employee")
    public ResponseEntity<List<User>> getAllEmployee() {
        List<User> projectManagers = userService.getAllEmployee();
        return ResponseEntity.ok(projectManagers);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/UPusers/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/uploadProfileImage/{userId}")
    public ResponseEntity<String> uploadProfileImage(@PathVariable("userId") Long userId, @RequestParam("file") MultipartFile file) {
        try {
            String responseMessage = userService.uploadProfileImage(userId, file);
            if (responseMessage.equals("User not found")) {
                return new ResponseEntity<>(responseMessage, HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(responseMessage, HttpStatus.OK);
            }
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest request) {
        try {
            userService.updatePassword(request.getUsername(), request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/DAllusers")
    @PreAuthorize("hasRole('ADMIN')")

    public ResponseEntity<HttpStatus> deleteAllUsers() {
        try {
            userRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> findUsersWithManagerOrRhRole() {
        return ResponseEntity.ok(userService.findUsersWithManagerOrRhRole());
    }
//
//    @GetMapping("/users")
//    public ResponseEntity<List<User>> findConnectedUsers() {
//        return ResponseEntity.ok(userService.findConnectedUsers());
//    }
    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }
    private String generateAndSaveActivationToken(User user) {
        // Generate a token
        String generatedToken = generateActivationCode(6);
        var token = ValidationToken.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .user(user)
                .build();
        validationTokenRepository.save(token);

        return generatedToken;
    }
    private void sendValidationEmail(User user , String Password) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getUsername(),
                Password,
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }
}
