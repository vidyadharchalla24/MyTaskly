package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.SubscriptionStatus;
import com.charan.mytaskly.entities.Subscriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionsRepository extends JpaRepository<Subscriptions,String> {

    @Query("SELECT sub FROM Subscriptions sub WHERE sub.user.userId=:userId")
    Subscriptions getSubscriptionsByUserId(@Param("userId") String userId);

    @Query("SELECT s FROM Subscriptions s WHERE s.endDate = :endDate")
    List<Subscriptions> findByEndDate(@Param("endDate") LocalDate endDate);

    @Query("SELECT s FROM Subscriptions s WHERE s.endDate < :today AND s.status = :status")
    List<Subscriptions> findByEndDateBeforeAndStatus(@Param("today") LocalDate today, @Param("status") SubscriptionStatus status);
}
