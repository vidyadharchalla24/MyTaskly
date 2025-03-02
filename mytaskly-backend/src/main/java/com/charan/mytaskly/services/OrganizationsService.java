package com.charan.mytaskly.services;

import com.charan.mytaskly.entities.Organizations;
import com.charan.mytaskly.entities.Projects;

import java.util.List;

public interface OrganizationsService {
    String saveOrganizations(String userId, String organizationName);

    List<Organizations> getAllOrganizations();

    Organizations getOrganizationByOrganizationsId(String organizationsId);

    String updateOrganizationName(String organizationName);

    String deleteOrganization(String organizationName);

    List<Projects> getAllProjectByOrganizationId(String organizationsId);
}
