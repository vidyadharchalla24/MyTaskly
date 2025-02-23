package com.charan.mytaskly.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @Column(name = "subscription_plan_id")
    private UUID subscriptionPlanId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,unique = true)
    private PlanType name;

    @Column(nullable = false)
    private int maxOrganizations;

    @Column(nullable = false)
    private int maxProjectsPerOrg;

    @Column(nullable = false)
    private int maxTeamMembersPerProject;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private int durationInDays;

    @OneToMany(mappedBy = "plan",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Subscriptions> subscriptions;

    public SubscriptionPlan() {
        super();
    }

    public SubscriptionPlan(PlanType name, int maxOrganizations, int maxProjectsPerOrg, int maxTeamMembersPerProject, BigDecimal price, int durationInDays) {
        this.name = name;
        this.maxOrganizations = maxOrganizations;
        this.maxProjectsPerOrg = maxProjectsPerOrg;
        this.maxTeamMembersPerProject = maxTeamMembersPerProject;
        this.price = price;
        this.durationInDays = durationInDays;
    }

    public UUID getSubscriptionPlanId() {
        return subscriptionPlanId;
    }

    public void setSubscriptionPlanId(UUID subscriptionPlanId) {
        this.subscriptionPlanId = subscriptionPlanId;
    }

    public PlanType getName() {
        return name;
    }

    public void setName(PlanType name) {
        this.name = name;
    }

    public int getMaxOrganizations() {
        return maxOrganizations;
    }

    public void setMaxOrganizations(int maxOrganizations) {
        this.maxOrganizations = maxOrganizations;
    }

    public int getMaxProjectsPerOrg() {
        return maxProjectsPerOrg;
    }

    public void setMaxProjectsPerOrg(int maxProjectsPerOrg) {
        this.maxProjectsPerOrg = maxProjectsPerOrg;
    }

    public int getMaxTeamMembersPerProject() {
        return maxTeamMembersPerProject;
    }

    public void setMaxTeamMembersPerProject(int maxTeamMembersPerProject) {
        this.maxTeamMembersPerProject = maxTeamMembersPerProject;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getDurationInDays() {
        return durationInDays;
    }

    public void setDurationInDays(int durationInDays) {
        this.durationInDays = durationInDays;
    }

    public List<Subscriptions> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<Subscriptions> subscriptions) {
        this.subscriptions = subscriptions;
    }
}
