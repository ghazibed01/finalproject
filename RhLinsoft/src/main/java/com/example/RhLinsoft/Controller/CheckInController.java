package com.example.RhLinsoft.Controller;

import com.example.RhLinsoft.Entities.CheckIn;
import com.example.RhLinsoft.Entities.Leave;
import com.example.RhLinsoft.Services.CheckIn.CheckInService;
import com.example.RhLinsoft.Services.Leave.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
public class CheckInController {

    @Autowired
    private CheckInService checkinService;

    @GetMapping("/allCheckIn")
    public List<CheckIn> getAllEvents() {
        return checkinService.getAllEvents();
    }

    @GetMapping("/CheckIn/{id}")
    public ResponseEntity<CheckIn> getEventById(@PathVariable Long id) {
        Optional<CheckIn> event = checkinService.getEventById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/CheckIn/user/{userId}")
    public ResponseEntity<List<CheckIn>> getAllEventsByUserId(@PathVariable Long userId) {
        List<CheckIn> events = checkinService.getAllEventsByUserId(userId);
        if (events.isEmpty()) {
            return ResponseEntity.noContent().build();  // Return 204 if no events found
        }
        return ResponseEntity.ok(events);
    }


    @PostMapping("/addChechIn")
    public ResponseEntity<?> createEvent(@RequestBody CheckIn calendarEvent) {
        try {
            CheckIn created = checkinService.createEvent(calendarEvent);
            return ResponseEntity.ok(created);
        } catch (IllegalStateException e) {
            // Return 400 Bad Request if the user already checked in today
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteCheckIn/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        checkinService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
