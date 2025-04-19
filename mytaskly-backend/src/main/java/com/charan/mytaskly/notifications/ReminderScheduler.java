package com.charan.mytaskly.notifications;

import com.charan.mytaskly.services.ReminderService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {

    private final ReminderService reminderService;

    public ReminderScheduler(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @Scheduled(cron = "0 05 18 * * ?")
    @Transactional// every day at 9 AM
    public void scheduleReminderCheck() throws MessagingException {
        reminderService.sendIssueReminders();
        reminderService.checkSubscriptionStatusAndNotify();
    }
}
