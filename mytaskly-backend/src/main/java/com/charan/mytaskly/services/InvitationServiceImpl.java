package com.charan.mytaskly.services;

import com.charan.mytaskly.emailconfigurations.EmailUtils;
import com.charan.mytaskly.entities.*;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.repository.InvitationRepository;
import com.charan.mytaskly.repository.ProjectAssignmentsRepository;
import com.charan.mytaskly.repository.ProjectsRepository;
import com.charan.mytaskly.repository.UsersRepository;
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

    private final UsersRepository usersRepository;

    public InvitationServiceImpl(InvitationRepository invitationRepository, ProjectsRepository projectsRepository, ProjectAssignmentsRepository projectAssignmentsRepository, EmailUtils emailUtils, Environment environment, UsersRepository usersRepository) {
        this.invitationRepository = invitationRepository;
        this.projectsRepository = projectsRepository;
        this.projectAssignmentsRepository = projectAssignmentsRepository;
        this.emailUtils = emailUtils;
        this.environment = environment;
        this.usersRepository = usersRepository;
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

        String link = environment.getProperty("FRONTEND_URL") + "/invite-response?token=" + token;
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
        String subject = "Collaboration Invitation for Project " + project.getProjectName() + " from " + project.getOrganization().getOrganizationName() + ".";
        emailUtils.sendEmail(email, subject, content);

    }

    @Override
    public String respondToInvitation(String token, boolean response) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid token"));

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            return "Invitation expired.";
        }

        // Check if already responded - return the same message as before to be idempotent
        if (invitation.isResponded()) {
            return response ? "Invitation accepted." : "Invitation rejected.";
        }

        // Update invitation status first
        invitation.setAccepted(response);
        invitation.setResponded(true);
        invitationRepository.save(invitation);

        Users users = usersRepository.findByEmail(invitation.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (response) {
            // Use transaction to ensure consistency
            boolean alreadyAssigned = projectAssignmentsRepository.existsByUsersAndProjects(
                    users, invitation.getProject()
            );

            if (!alreadyAssigned) {
                ProjectAssignments projectAssignments = new ProjectAssignments();
                projectAssignments.setRole(Role.DEV);
                projectAssignments.setProjects(invitation.getProject());
                projectAssignments.setUsers(users);
                projectAssignments.setProjectAssignmentsId(UUID.randomUUID().toString());

                projectAssignmentsRepository.save(projectAssignments);
            }

            return "Invitation accepted.";
        }

        return "Invitation rejected.";
    }

}
