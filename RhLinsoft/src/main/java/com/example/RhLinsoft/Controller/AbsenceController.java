package com.example.RhLinsoft.Controller;


import com.example.RhLinsoft.Entities.Absence;
import com.example.RhLinsoft.Services.Absence.AbsenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
public class AbsenceController {

    @Autowired
    private AbsenceService absenceService;

    @GetMapping("allProjects")
    public List<Absence> getAllProjects() {
        return absenceService.getAllProjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Absence> getProjectById(@PathVariable Long id) {
        return absenceService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("addProject")
    public Absence createProject(@RequestBody Absence project) {
        return absenceService.saveProject(project);
    }

    @PutMapping("updateProject/{id}")
    public ResponseEntity<Absence> updateProject(@PathVariable Long id, @RequestBody Absence projectDetails) {
        Optional<Absence> project = absenceService.getProjectById(id);

        if (project.isPresent()) {
            Absence projectToUpdate = project.get();
            projectToUpdate.setStartDate(projectDetails.getStartDate());
            projectToUpdate.setEndDate(projectDetails.getEndDate());
            Absence updatedProject = absenceService.saveProject(projectToUpdate);
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("deleteProject/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!absenceService.getProjectById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        absenceService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/Done/{id}")
    public ResponseEntity<Absence> updateProjectStatusToDone(@PathVariable Long id) {
        Absence updatedProject = absenceService.updateStatusToDone(id); // Update status to DONE
        return ResponseEntity.ok(updatedProject); // Return updated project
    }

    @PutMapping("/Rejected/{id}")
    public ResponseEntity<Absence> updateProjectStatusToReject(@PathVariable Long id) {
        Absence updatedProject = absenceService.updateStatusToReject(id); // Update status to DONE
        return ResponseEntity.ok(updatedProject); // Return updated project
    }
    @GetMapping("/{idProject}/UML")
    public ResponseEntity<byte[]> getUML(@PathVariable Long idProject) {
        List<byte[]> files = absenceService.getUMLForProject(idProject);
        if (files != null && !files.isEmpty()) {
            // Assuming you only want to return the first file or combine them
            byte[] file = files.get(0); // Adjust this logic as needed
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF) // Set Content-Type as PDF
                    .body(file);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/{idProject}/AddUML")
    public ResponseEntity<String> addUML(@PathVariable Long idProject,
                                           @RequestParam("UML") MultipartFile file) {
        try {
            byte[] fileData = file.getBytes();
            Absence project = absenceService.addUmlToProject(idProject,fileData);
            return ResponseEntity.status(HttpStatus.CREATED).body("File uploaded successfully: " + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + file.getOriginalFilename());
        }

    }
    @GetMapping("/absences/user/{userId}")
    public ResponseEntity<List<Absence>> getAbsencesByUserId(@PathVariable Long userId) {
        List<Absence> absences = absenceService.findByUserId(userId);
        return ResponseEntity.ok(absences);
    }
}
