package com.charan.mytaskly.repository;

import com.charan.mytaskly.entities.Subscriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionsRepository extends JpaRepository<Subscriptions,String> {

    @Query("SELECT sub FROM Subscriptions sub WHERE sub.user.userId=:userId")
    Subscriptions getSubscriptionsByUserId(@Param("userId") String userId);

}
