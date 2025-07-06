package com.example.RhLinsoft.Entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "`leave`")
@Data
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(nullable = false, columnDefinition = "varchar(255) default 'pending'")
    private String category = "pending";
    private LocalDate startDate;
    private LocalDate endDate;
    private String details;
    private Long userId;
    private String userEmail;
    private String userName;


}
