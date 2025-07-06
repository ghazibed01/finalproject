package com.example.RhLinsoft.Controller;

import com.example.RhLinsoft.Entities.MonthlyTicket;
import com.example.RhLinsoft.Services.TicketSummaryScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
public class TicketController {


        @Autowired
        private TicketSummaryScheduler scheduler;

        @GetMapping("/sendMonthlyEmails")
        public ResponseEntity<String> sendMonthlyEmailsNow() {
            scheduler.sendMonthlyTicketSummaries();
            return ResponseEntity.ok("Emails envoyés avec succès !");
        }
        @GetMapping("/allTickets")
        public ResponseEntity<List<MonthlyTicket>> getAllTickets() {
            List<MonthlyTicket> tickets = scheduler.getAllTickets(); // Appel via service
            return ResponseEntity.ok(tickets);
        }
    }

