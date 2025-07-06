package com.example.RhLinsoft.Services.Leave;

import com.example.RhLinsoft.Entities.Leave;
import com.example.RhLinsoft.Entities.LeaveBalance;
import com.example.RhLinsoft.Repositories.LeaveBalanceRepository;
import com.example.RhLinsoft.Repositories.LeaveRepository;
import com.example.RhLinsoft.Services.Email.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveServiceImpl implements LeaveService {
    @Autowired
    private LeaveRepository calenderRepository;

    @Autowired
    private EmailService emailService;
    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;
    @Override
    public List<Leave> getAllEvents() {
        return calenderRepository.findAll();
    }
    @Override
    public List<Leave> getAllEventsByUserId(Long userId) {
        return calenderRepository.findByUserId(userId);
    }
    @Override
    public Optional<Leave> getEventById(Long id) {
        return calenderRepository.findById(id);
    }
    @Override
    public Leave createEvent(Leave calendarEvent) {
        return calenderRepository.save(calendarEvent);
    }
    @Override
    public Leave updateEvent(Long id, Leave eventDetails) {
        Optional<Leave> eventOpt = calenderRepository.findById(id);
        if (eventOpt.isEmpty()) throw new RuntimeException("Event not found");

        Leave event = eventOpt.get();
        event.setTitle(eventDetails.getTitle());
        event.setCategory(eventDetails.getCategory());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setDetails(eventDetails.getDetails());

        Leave savedEvent = calenderRepository.save(event);

        // 🎯 Réduction du solde seulement si l'état est "approved"
        if ("approved".equalsIgnoreCase(savedEvent.getCategory())) {
            int currentYear = LocalDate.now().getYear();
            LeaveBalance balance = leaveBalanceRepository.findByUserIdAndYear(savedEvent.getUserId(), currentYear)
                    .orElseGet(() -> {
                        LeaveBalance newBalance = new LeaveBalance();
                        newBalance.setUserId(savedEvent.getUserId());
                        newBalance.setYear(currentYear);
                        newBalance.setRemainingDays(21);
                        return newBalance;
                    });

            long leaveDays = ChronoUnit.DAYS.between(savedEvent.getStartDate(), savedEvent.getEndDate()) + 1;

            if (balance.getRemainingDays() >= leaveDays) {
                balance.setRemainingDays(balance.getRemainingDays() - (int) leaveDays);
                leaveBalanceRepository.save(balance);
            } else {
                throw new RuntimeException("Solde insuffisant pour ce congé !");
            }
        }

        // 🔔 Envoie de mail avec solde
        try {
            LeaveBalance userBalance = leaveBalanceRepository
                    .findByUserIdAndYear(savedEvent.getUserId(), LocalDate.now().getYear())
                    .orElse(null);

            int remainingDays = userBalance != null ? userBalance.getRemainingDays() : 21;

            emailService.sendEmail(
                    savedEvent.getUserEmail(),
                    savedEvent.getUserName(),
                    savedEvent.getStartDate().toString(),
                    savedEvent.getEndDate().toString(),
                    savedEvent.getTitle(),
                    savedEvent.getCategory(),
                    savedEvent.getDetails(),
                    "Statut mis à jour - Congés restants : " + remainingDays + " jours"
            );
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        return savedEvent;
    }

    @Scheduled(cron = "0 0 0 1 1 *") // chaque 1er janvier à 00h00
    public void resetLeaveBalances() {
        List<LeaveBalance> balances = leaveBalanceRepository.findAll();
        for (LeaveBalance balance : balances) {
            balance.setRemainingDays(21);
            balance.setYear(LocalDate.now().getYear());
            leaveBalanceRepository.save(balance);
        }
    }
@Override
    public void deleteEvent(Long id) {
        calenderRepository.deleteById(id);
    }
}