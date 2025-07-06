package com.example.RhLinsoft.Repositories;


import com.example.RhLinsoft.Entities.Absence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    List<Absence> findByUserId(Long userId);

}
