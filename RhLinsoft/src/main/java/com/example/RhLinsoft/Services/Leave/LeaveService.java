package com.example.RhLinsoft.Services.Leave;

import com.example.RhLinsoft.Entities.Leave;

import java.util.List;
import java.util.Optional;

public interface LeaveService {
    public List<Leave> getAllEvents();
    public List<Leave> getAllEventsByUserId(Long userId);
    public Optional<Leave> getEventById(Long id);
    public Leave createEvent(Leave calendarEvent);
    public Leave updateEvent(Long id, Leave eventDetails);
    public void deleteEvent(Long id);

}
