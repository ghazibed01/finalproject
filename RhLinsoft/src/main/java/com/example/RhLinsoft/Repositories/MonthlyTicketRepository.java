package com.example.RhLinsoft.Repositories;

import com.example.RhLinsoft.Entities.MonthlyTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MonthlyTicketRepository extends JpaRepository<MonthlyTicket, Long> {
    Optional<MonthlyTicket> findByUserIdAndMonthAndYear(Long userId, int month, int year);

    List<MonthlyTicket> findByMonthAndYear(int month, int year);
}
