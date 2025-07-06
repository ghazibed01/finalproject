package com.example.RhLinsoft.Repositories;

import com.example.RhLinsoft.Entities.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave,Long> {
    List<Leave> findByUserId(Long userId);
}
