package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.entities.Role;
import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.repository.UsersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsersServiceImpl implements UsersService{

    private final UsersRepository usersRepository;

    private final ImageUploadCloudinary imageUploadCloudinary;

    private final PasswordEncoder passwordEncoder;

    public UsersServiceImpl(UsersRepository usersRepository, ImageUploadCloudinary imageUploadCloudinary, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.imageUploadCloudinary = imageUploadCloudinary;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public ResponseEntity<String> saveUser(UsersDto usersDto) {
        Optional<Users> existingUser = usersRepository.findByEmail(usersDto.getEmail());
        if(existingUser.isPresent()){
            return ResponseEntity.badRequest().body("Email is already in use.");
        }
        String hashPassword = passwordEncoder.encode(usersDto.getPassword());
        Users newUser = new Users();
        newUser.setUserId(UUID.randomUUID().toString());
        newUser.setEmail(usersDto.getEmail());
        newUser.setName(usersDto.getName());
        newUser.setRole(Role.OWNER);
        newUser.setPassword(hashPassword);
        newUser.setImageUrl(usersDto.getImageUrl());

        usersRepository.save(newUser);
        return new ResponseEntity<String>("User added Successfully", HttpStatus.OK);
    }

    @Override
    public String uploadProfileImage(String userId, MultipartFile file) throws IOException {
        Optional<Users> existingUser = usersRepository.findById(userId);
        if(existingUser.isPresent()){
            Users users = existingUser.get();

            // If user already has an existing profile image, delete it from Cloudinary
            if (users.getImageUrl() != null) {
                deleteImageFromCloudinary(users.getImageUrl());
            }

            String imageUrl = imageUploadCloudinary.uploadImage(file);
            users.setImageUrl(imageUrl);
            usersRepository.save(users);
            return "Profile image Uploaded Successfully!!" + imageUrl;
        }
        return "User is not Found!";
    }

    @Override
    public String removeProfileImage(String userId) throws IOException {
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();

            if (user.getImageUrl() != null) {
                // Delete the image from Cloudinary
                deleteImageFromCloudinary(user.getImageUrl());

                // Set profile image URL to null in the database
                user.setImageUrl(null);
                usersRepository.save(user);

                return "Profile image removed successfully!";
            }
            return "No profile image found to remove!";
        }
        return "User not found!";
    }

    /**
     * Helper method to extract public ID from Cloudinary URL and delete the image
     */
    private void deleteImageFromCloudinary(String imageUrl) throws IOException {
        String publicId = extractPublicIdFromUrl(imageUrl);

        if (publicId != null) {
            String data = imageUploadCloudinary.deleteImage(publicId);
        }
    }

    /**
     * Extracts public ID from Cloudinary image URL
     */
    private String extractPublicIdFromUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("/")) {
            return null;
        }

        String publicIdWithExtension = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        return publicIdWithExtension.split("\\.")[0]; // Remove file extension
    }
}
