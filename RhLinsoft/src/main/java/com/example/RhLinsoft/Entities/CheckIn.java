package com.example.RhLinsoft.Entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "`checkIn`")
@Data
public class CheckIn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate time;
    private Long userId;
    private String userEmail;
    private String userName;


}
