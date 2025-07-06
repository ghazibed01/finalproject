package com.example.RhLinsoft.Repositories;

import com.example.RhLinsoft.Entities.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChechInRepository extends JpaRepository<CheckIn,Long> {
    List<CheckIn> findByUserId(Long userId);
    Optional<CheckIn> findByUserIdAndTime(Long userId, LocalDate time);

}
