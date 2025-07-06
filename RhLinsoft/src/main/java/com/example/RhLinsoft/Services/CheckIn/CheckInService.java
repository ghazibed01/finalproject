package com.example.RhLinsoft.Services.CheckIn;

import com.example.RhLinsoft.Entities.CheckIn;
import com.example.RhLinsoft.Entities.Leave;

import java.util.List;
import java.util.Optional;

public interface CheckInService {
    public List<CheckIn> getAllEvents();
    public List<CheckIn> getAllEventsByUserId(Long userId);
    public Optional<CheckIn> getEventById(Long id);
    public CheckIn createEvent(CheckIn calendarEvent);
    public void deleteEvent(Long id);

}
