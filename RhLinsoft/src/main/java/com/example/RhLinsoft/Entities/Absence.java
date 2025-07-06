package com.example.RhLinsoft.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "absence")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // Include only specific fields
public class Absence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Only include id in equals and hashCode
    private Long id;
    private String UserName;
    private Long userId;
    private String description;

    @ElementCollection
    @CollectionTable(name = "file_Justification", joinColumns = @JoinColumn(name = "absence_id"))
    @Column(name = "Justification_content", columnDefinition = "LONGBLOB")
    private List<byte[]> Justification;
    private LocalDate startDate;
    private LocalDate endDate;

    public enum Status {
        Done,
        In_Progress,
        Rejected
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255) default 'IN_PROGRESS'")
    private Status status = Status.In_Progress;


}