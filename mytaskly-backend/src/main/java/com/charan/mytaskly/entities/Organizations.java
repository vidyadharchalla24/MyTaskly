package com.charan.mytaskly.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "organizations")
public class Organizations {

    @Id
    @Column(name = "organizations_id")
    private UUID organizationsId;

    @Column(name = "organization_name",unique = true,nullable = false)
    private String organizationName;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonBackReference
    private Users owner;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Projects> projects;

    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscriptions subscriptions;

    public Organizations() {
        super();
    }

    public Organizations(UUID organizationsId, String organizationName, Users owner, List<Projects> projects, Subscriptions subscriptions) {
        this.organizationsId = organizationsId;
        this.organizationName = organizationName;
        this.owner = owner;
        this.projects = projects;
        this.subscriptions = subscriptions;
    }

    public UUID getOrganizationsId() {
        return organizationsId;
    }

    public void setOrganizationsId(UUID organizationsId) {
        this.organizationsId = organizationsId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public Users getOwner() {
        return owner;
    }

    public void setOwner(Users owner) {
        this.owner = owner;
    }

    public List<Projects> getProjects() {
        return projects;
    }

    public void setProjects(List<Projects> projects) {
        this.projects = projects;
    }

    public Subscriptions getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(Subscriptions subscriptions) {
        this.subscriptions = subscriptions;
    }
}
