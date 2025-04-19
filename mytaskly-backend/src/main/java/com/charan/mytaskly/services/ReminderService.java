package com.charan.mytaskly.services;

import com.charan.mytaskly.emailconfigurations.EmailUtils;
import com.charan.mytaskly.entities.*;
import com.charan.mytaskly.repository.SprintsRepository;
import com.charan.mytaskly.repository.SubscriptionsRepository;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    private final SprintsRepository sprintsRepository;

    private final EmailUtils emailUtils;

    private final SubscriptionsRepository subscriptionsRepository;

    public ReminderService(SprintsRepository sprintsRepository, EmailUtils emailUtils, SubscriptionsRepository subscriptionsRepository) {
        this.sprintsRepository = sprintsRepository;
        this.emailUtils = emailUtils;
        this.subscriptionsRepository = subscriptionsRepository;
    }

    public void sendIssueReminders() throws MessagingException {
        LocalDate targetDate = LocalDate.now().plusDays(2);
        List<Sprints> sprintsEndingSoon = sprintsRepository.findSprintsEndingOn(targetDate);

        for (Sprints sprint : sprintsEndingSoon) {
            for (Issues issue : sprint.getIssues()) {
                if (issue.getIssueStatus() != IssueStatus.DONE) {
                    sendReminder(issue);
                }
            }
        }
    }

    private void sendReminder(Issues issue) throws MessagingException {
        Users assignee = issue.getAssignee();
        Users reporter = issue.getReporter();

        String subject = "Reminder: Issue \"" + issue.getTitle() + "\" needs attention";
        String message = "The sprint is ending in 2 days. Please ensure the issue \"" + issue.getTitle()
                + "\" is completed before the deadline (" + issue.getSprints().getEndDate() + ").";

        if (assignee != null) {
            emailUtils.sendEmail(assignee.getEmail(), subject, message);
        }
        if (reporter != null && !reporter.equals(assignee)) {
            emailUtils.sendEmail(reporter.getEmail(), subject, message);
        }
    }

    public void checkSubscriptionStatusAndNotify() throws MessagingException {
        LocalDate today = LocalDate.now();
        LocalDate twoDaysLater = today.plusDays(2);

        // Notify users whose subscriptions end in 2 days
        List<Subscriptions> endingSoon = subscriptionsRepository.findByEndDate(twoDaysLater);
        for (Subscriptions sub : endingSoon) {
            if (sub.getStatus() == SubscriptionStatus.ACTIVE) {
                String subject = "🚨 Reminder: Subscription expiring on " + sub.getEndDate();
                String message = "Hi " + sub.getUser().getName() + ",\n\n"
                        + "We noticed that your subscription is set to expire on " + sub.getEndDate() + ". "
                        + "To continue enjoying uninterrupted access to all features, please upgrade or renew your plan before the expiry date.\n\n"
                        + "Visit your account settings to manage your subscription.\n\n"
                        + "Thank you,\nThe MyTaskly Team";

                emailUtils.sendEmail(
                        sub.getUser().getEmail(),
                        subject,
                        message
                );
            }
        }

        // Mark expired subscriptions as INACTIVE
        List<Subscriptions> expired = subscriptionsRepository
                .findByEndDateBeforeAndStatus(today, SubscriptionStatus.ACTIVE);

        for (Subscriptions sub : expired) {
            sub.setStatus(SubscriptionStatus.EXPIRED);
        }

        subscriptionsRepository.saveAll(expired);
    }

}
