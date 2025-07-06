package com.example.RhLinsoft.Repositories;

import com.example.RhLinsoft.Entities.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    Optional<LeaveBalance> findByUserIdAndYear(Long userId, int year);
}