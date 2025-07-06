package com.example.RhLinsoft.Services;

import com.example.RhLinsoft.Entities.MonthlyTicket;
import com.example.RhLinsoft.Repositories.MonthlyTicketRepository;
import com.example.RhLinsoft.Services.Email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

@Service
public class TicketSummaryScheduler {

    @Autowired
    private MonthlyTicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 8 1 * ?") // 1er jour du mois à 08:00
    public void sendMonthlyTicketSummaries() {
        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        int month = lastMonth.getMonthValue();
        int year = lastMonth.getYear();

        List<MonthlyTicket> tickets = ticketRepository.findByMonthAndYear(month, year);
        System.out.println(">>> Envoi des emails de tickets mensuels...");
        System.out.println("Mois ciblé : " + month + ", Année : " + year);
        System.out.println("Nombre d'utilisateurs : " + tickets.size());
        for (MonthlyTicket ticket : tickets) {
            String email = ticket.getUserEmail();
            String name = ticket.getUserName();
            int count = ticket.getTicketCount();
            System.out.println("Envoi à : " + email + " | Tickets: " + count);
            try {
                emailService.sendTicketSummaryEmail(email, name, count, lastMonth);
            } catch (Exception e) {
                System.err.println("Erreur d'envoi à " + email + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
    public List<MonthlyTicket> getAllTickets() {
        return ticketRepository.findAll();
    }
}