package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.OrganizerDto;
import com.charan.mytaskly.entities.*;
import com.charan.mytaskly.exception.AlreadyExistsException;
import com.charan.mytaskly.exception.ResourceNotFoundException;
import com.charan.mytaskly.exception.SubscriptionExpiryException;
import com.charan.mytaskly.repository.OrganizationsRepository;
import com.charan.mytaskly.repository.SubscriptionsRepository;
import com.charan.mytaskly.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrganizationsServiceImpl implements OrganizationsService{

    private final OrganizationsRepository organizationsRepository;

    private final UsersRepository usersRepository;

    private final SubscriptionsRepository subscriptionsRepository;

    public OrganizationsServiceImpl(OrganizationsRepository organizationsRepository, UsersRepository usersRepository, SubscriptionsRepository subscriptionsRepository) {
        this.organizationsRepository = organizationsRepository;
        this.usersRepository = usersRepository;
        this.subscriptionsRepository = subscriptionsRepository;
    }

    @Override
    public String saveOrganizations(String userId, String organizationName) {
        // Check if organization already exists
        if (organizationsRepository.getOrganizationsByOrganizationsName(organizationName) != null) {
            throw new AlreadyExistsException("Organization already exists");
        }

        // Retrieve user and subscription details
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not Found!!"));

        Subscriptions subscription = subscriptionsRepository.getSubscriptionsByUserId(userId);
        if (subscription == null) {
            throw new ResourceNotFoundException("Subscriptions not Found!!");
        }

        int organizationCount = organizationsRepository.getCountOfOrganizationsUnderUserByUserId(userId);
        int maxAllowedOrganizations = subscription.getPlan().getMaxOrganizations();

        // Validate subscription limits
        if (organizationCount >= maxAllowedOrganizations) {
            if(subscription.getPlan().getName().equals(PlanType.ADVANCED)){
                throw new SubscriptionExpiryException("Limit has reached for "+subscription.getPlan().getName()+" Plan... ");
            }
            throw new SubscriptionExpiryException("Limit has reached for "+subscription.getPlan().getName()+".. Please upgrade your plan... ");
        }

        // Create and save new organization
        Organizations newOrganization = new Organizations();
        newOrganization.setOrganizationsId(UUID.randomUUID().toString());
        newOrganization.setOrganizationName(organizationName);
        newOrganization.setOwner(user);
        organizationsRepository.save(newOrganization);

        return "Organization added successfully!";
    }

    @Override
    public List<OrganizerDto> getAllOrganizations() {
        List<Organizations> organizationsList = organizationsRepository.findAll();

        if (organizationsList.isEmpty()) {
            throw new ResourceNotFoundException("No Organizations Exist...");
        }

        return organizationsList.stream()
                .map(org -> new OrganizerDto(org.getOrganizationsId(), org.getOrganizationName()))
                .collect(Collectors.toList());
    }

    @Override
    public String updateOrganizationName(String organizationName) {
        Organizations organizations = organizationsRepository.getOrganizationsByOrganizationsName(organizationName);
        if(organizations == null){
            throw new ResourceNotFoundException("No Organization Exists");
        }
        organizations.setOrganizationName(organizationName);
        organizationsRepository.save(organizations);
        return "Organization name updated Successfully!!";
    }

    @Override
    public String deleteOrganization(String organizationName) {
        Organizations organizations = organizationsRepository.getOrganizationsByOrganizationsName(organizationName);
        if(organizations == null){
            throw new ResourceNotFoundException("No Organization Exists");
        }
        organizationsRepository.delete(organizations);
        return "Organization deleted successfully.";
    }

    @Override
    public List<Projects> getAllProjectByOrganizationId(String organizationsId) {
        List<Projects> projectsList = organizationsRepository.getAllProjectByOrganizationId(organizationsId);

        if (projectsList.isEmpty()) {
            throw new ResourceNotFoundException("No Projects Available!!");
        }

        return projectsList;
    }

    @Override
    public List<OrganizerDto> getOrganizationByUserId(String userId) {
        List<Organizations> organizationsList = organizationsRepository.getOrganizationByUserId(userId);

        // Convert to DTOs and return
        return organizationsList.stream()
                .map(org -> new OrganizerDto(
                        org.getOrganizationsId(),
                        org.getOrganizationName()
                ))
                .collect(Collectors.toList());
    }



}
