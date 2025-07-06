package com.example.RhLinsoft.Services.CheckIn;

import com.example.RhLinsoft.Entities.CheckIn;
import com.example.RhLinsoft.Entities.Leave;
import com.example.RhLinsoft.Entities.MonthlyTicket;
import com.example.RhLinsoft.Repositories.ChechInRepository;
import com.example.RhLinsoft.Repositories.MonthlyTicketRepository;
import com.example.RhLinsoft.Services.Email.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CheckInServiceImpl implements CheckInService {
    @Autowired
    private ChechInRepository chechInRepository;
    @Autowired
    private MonthlyTicketRepository monthlyTicketRepository;
    @Override
    public List<CheckIn> getAllEvents() {
        return chechInRepository.findAll();
    }
    @Override
    public List<CheckIn> getAllEventsByUserId(Long userId) {
        return chechInRepository.findByUserId(userId);
    }
    @Override
    public Optional<CheckIn> getEventById(Long id) {
        return chechInRepository.findById(id);
    }
    @Override
    public CheckIn createEvent(CheckIn calendarEvent) {
        LocalDate today = LocalDate.now();

        // Empêcher le double pointage
        Optional<CheckIn> existingCheckIn = chechInRepository.findByUserIdAndTime(calendarEvent.getUserId(), today);
        if (existingCheckIn.isPresent()) {
            throw new IllegalStateException("User has already checked in today.");
        }

        // Sauvegarder le check-in
        CheckIn savedCheckIn = chechInRepository.save(calendarEvent);

        // Mettre à jour les tickets mensuels
        int month = today.getMonthValue();
        int year = today.getYear();
        Long userId = calendarEvent.getUserId();

        MonthlyTicket ticket = monthlyTicketRepository
                .findByUserIdAndMonthAndYear(userId, month, year)
                .orElseGet(() -> {
                    MonthlyTicket newTicket = new MonthlyTicket();
                    newTicket.setUserId(userId);
                    newTicket.setUserEmail(calendarEvent.getUserEmail());
                    newTicket.setUserName(calendarEvent.getUserName());
                    newTicket.setMonth(month);
                    newTicket.setYear(year);
                    return newTicket;
                });

        ticket.incrementTickets();
        monthlyTicketRepository.save(ticket);

        return savedCheckIn;
    }
//    public CheckIn createEvent(CheckIn calendarEvent) {
//        LocalDate today = LocalDate.now();
//
//        // Use the new repository method
//        Optional<CheckIn> existingCheckIn = chechInRepository.findByUserIdAndTime(calendarEvent.getUserId(), today);
//
//        if (existingCheckIn.isPresent()) {
//            throw new IllegalStateException("User has already checked in today.");
//        }
//
//        return chechInRepository.save(calendarEvent);
//    }
    @Override
    public void deleteEvent(Long id) {
        chechInRepository.deleteById(id);
    }
}