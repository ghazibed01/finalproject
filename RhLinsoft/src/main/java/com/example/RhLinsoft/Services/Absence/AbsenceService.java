package com.example.RhLinsoft.Services.Absence;


import com.example.RhLinsoft.Entities.Absence;

import java.util.List;
import java.util.Optional;

public interface AbsenceService {
    public List<Absence> getAllProjects();
    public Absence saveProject(Absence project);
    public Optional<Absence> getProjectById(Long id);
    public void deleteProject(Long id);
    public Absence updateStatusToDone(Long projectId);
    public Absence addUmlToProject(Long idProject, byte[]  file);
    public List<byte[]> getUMLForProject(Long idProject);
    List<Absence> findByUserId(Long userId);
    public Absence updateStatusToReject(Long projectId);

}



