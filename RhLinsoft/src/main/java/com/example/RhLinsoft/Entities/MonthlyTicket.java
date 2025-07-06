package com.example.RhLinsoft.Entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "month", "year"})
})
public class MonthlyTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userEmail;
    private String userName;

    private int month; // 1 - 12
    private int year;

    private int ticketCount = 0;

    public void incrementTickets() {
        this.ticketCount++;
    }
}
