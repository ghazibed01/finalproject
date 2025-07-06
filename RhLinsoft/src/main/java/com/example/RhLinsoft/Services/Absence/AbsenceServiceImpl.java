package com.example.RhLinsoft.Services.Absence;

import com.example.RhLinsoft.Entities.Absence;
import com.example.RhLinsoft.Repositories.AbsenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class AbsenceServiceImpl implements AbsenceService {

    @Autowired
    private AbsenceRepository projectRepository;

    @Override
    public List<Absence> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Absence saveProject(Absence project) {
        return projectRepository.save(project);
    }

    @Override
    public Optional<Absence> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    @Override
    public void deleteProject(Long id) {
       projectRepository.deleteById(id);
    }

//    @Override
//    @Transactional
//    public void deleteProject(Long id) {
//        Optional<Project> projectOptional = projectRepository.findById(id);
//
//        if (projectOptional.isPresent()) {
//            Project project = projectOptional.get();
//
//            // Step 1: Clear the technologies association
//            project.getTechnologies().clear();
//            projectRepository.save(project); // Persist changes
//
//            // Step 2: Delete the project itself
//            projectRepository.deleteById(id);
//        } else {
//            throw new EntityNotFoundException("Project with ID " + id + " not found");
//        }
//    }

    @Override
    public Absence updateStatusToDone(Long projectId) {
        Optional<Absence> optionalProject = projectRepository.findById(projectId);

        if (optionalProject.isPresent()) {
            Absence project = optionalProject.get();
            project.setStatus(Absence.Status.Done);
            projectRepository.save(project);
            return project;
        } else {
            throw new IllegalArgumentException("Project not found with id: " + projectId);
        }
    }
    @Override
    public Absence updateStatusToReject(Long projectId) {
        Optional<Absence> optionalProject = projectRepository.findById(projectId);

        if (optionalProject.isPresent()) {
            Absence project = optionalProject.get();
            project.setStatus(Absence.Status.Rejected);
            projectRepository.save(project);
            return project;
        } else {
            throw new IllegalArgumentException("Project not found with id: " + projectId);
        }
    }
    @Override
    public Absence addUmlToProject(Long idProject, byte[]  file) {
        Absence project = projectRepository.findById(idProject)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Historique ID: " + idProject));
        project.getJustification().add(file);
        return projectRepository.save(project);
    }

    public List<byte[]> getUMLForProject(Long idProject) {
        Optional<Absence> project = projectRepository.findById(idProject);
        return project.get().getJustification();
    }
    @Override
    public List<Absence> findByUserId(Long userId) {
        return projectRepository.findByUserId(userId);
    }

}