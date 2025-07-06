package com.example.RhLinsoft.Controller;

import com.example.RhLinsoft.Entities.Leave;
import com.example.RhLinsoft.Services.Leave.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
public class LeaveController {

    @Autowired
    private LeaveService calendarService;

    @GetMapping("/allCalendar")
    public List<Leave> getAllEvents() {
        return calendarService.getAllEvents();
    }

    @GetMapping("/Calendar/{id}")
    public ResponseEntity<Leave> getEventById(@PathVariable Long id) {
        Optional<Leave> event = calendarService.getEventById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/calendars/user/{userId}")
    public ResponseEntity<List<Leave>> getAllEventsByUserId(@PathVariable Long userId) {
        List<Leave> events = calendarService.getAllEventsByUserId(userId);
        if (events.isEmpty()) {
            return ResponseEntity.noContent().build();  // Return 204 if no events found
        }
        return ResponseEntity.ok(events);
    }


    @PostMapping("/addCalendar")
    public Leave createEvent(@RequestBody Leave calendarEvent) {
        return calendarService.createEvent(calendarEvent);
    }

    @PutMapping("/updateCalendar/{id}")
    public ResponseEntity<Leave> updateEvent(@PathVariable Long id, @RequestBody Leave calendarEvent) {
        return ResponseEntity.ok(calendarService.updateEvent(id, calendarEvent));
    }

    @DeleteMapping("/deleteCalendar/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        calendarService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
