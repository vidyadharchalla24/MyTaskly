package com.charan.mytaskly.services;

import com.charan.mytaskly.emailconfigurations.EmailUtils;
import com.charan.mytaskly.entities.Invitation;
import com.charan.mytaskly.entities.ProjectAssignments;
import com.charan.mytaskly.entities.Projects;
import com.charan.mytaskly.entities.Role;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.repository.InvitationRepository;
import com.charan.mytaskly.repository.ProjectAssignmentsRepository;
import com.charan.mytaskly.repository.ProjectsRepository;
import jakarta.mail.MessagingException;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InvitationServiceImpl implements InvitationService {

    private final InvitationRepository invitationRepository;

    private final ProjectsRepository projectsRepository;

    private final ProjectAssignmentsRepository projectAssignmentsRepository;

    private final EmailUtils emailUtils;

    private final Environment environment;

    public InvitationServiceImpl(InvitationRepository invitationRepository, ProjectsRepository projectsRepository, ProjectAssignmentsRepository projectAssignmentsRepository, EmailUtils emailUtils, Environment environment) {
        this.invitationRepository = invitationRepository;
        this.projectsRepository = projectsRepository;
        this.projectAssignmentsRepository = projectAssignmentsRepository;
        this.emailUtils = emailUtils;
        this.environment = environment;
    }

    @Override
    public void sendInvitation(String email, String projectId) throws MessagingException {
        Projects project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        String token = UUID.randomUUID().toString();
        String id = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        Invitation invitation = new Invitation();
        invitation.setId(id);
        invitation.setEmail(email);
        invitation.setToken(token);
        invitation.setProject(project);
        invitation.setExpiresAt(expiry);
        invitation.setAccepted(false);
        invitation.setResponded(false);

        invitationRepository.save(invitation);

        String link = environment.getProperty("FRONTEND_URL")+"/invite-response?token=" + token;
        String content = "<html>" +
                "<body>" +
                "<p>Hello,</p>" +
                "<p>You have been invited to join the project <strong>" + project.getProjectName() + "</strong>.</p>" +
                "<p>Please respond to the invitation within <strong>15 minutes</strong>.</p>" +
                "<p>" +
                "<a href=\"" + link + "&response=accept\" style=\"background-color:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;\">Accept Invitation</a>" +
                " &nbsp; " +
                "<a href=\"" + link + "&response=reject\" style=\"background-color:#f44336;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;\">Reject Invitation</a>" +
                "</p>" +
                "<p>If you did not expect this email, you can ignore it.</p>" +
                "</body>" +
                "</html>";
        String subject = "Collaboration Invitation for Project "+project.getProjectName()+" from "+ project.getOrganization().getOrganizationName()+".";
        emailUtils.sendEmail(email,subject,content);

    }

    @Override
    public String respondToInvitation(String token, boolean response) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid token"));
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            return "Invitation expired.";
        }

        if (invitation.isResponded()) {
            return "Invitation already responded.";
        }

        invitation.setAccepted(response);
        invitation.setResponded(true);
        invitationRepository.save(invitation);
        if(response){
            ProjectAssignments projectAssignments = new ProjectAssignments();
            projectAssignments.setRole(Role.DEV);
            projectAssignments.setProjects(invitation.getProject());
            projectAssignments.setUsers(null);
            projectAssignments.setProjectAssignmentsId(UUID.randomUUID().toString());
            projectAssignmentsRepository.save(projectAssignments);
            return "Invitation accepted.";
        }

        return "Invitation rejected.";
    }
}
