package com.charan.mytaskly.dto;

import jakarta.persistence.Column;

public class OrganizerDto {

    private String organizationsId;

    private String organizationName;

    public OrganizerDto(String organizationsId, String organizationName) {
        this.organizationsId = organizationsId;
        this.organizationName = organizationName;
    }

    public OrganizerDto() {
        super();
    }

    public String getOrganizationsId() {
        return organizationsId;
    }

    public void setOrganizationsId(String organizationsId) {
        this.organizationsId = organizationsId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
}
