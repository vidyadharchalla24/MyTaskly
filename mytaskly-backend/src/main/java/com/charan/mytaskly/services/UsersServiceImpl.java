package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.PasswordDto;
import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.emailconfigurations.EmailUtils;
import com.charan.mytaskly.entities.*;
import com.charan.mytaskly.exception.*;
import com.charan.mytaskly.repository.OneTimePasswordRepository;
import com.charan.mytaskly.repository.SubscriptionPlanRepository;
import com.charan.mytaskly.repository.SubscriptionsRepository;
import com.charan.mytaskly.repository.UsersRepository;
import jakarta.mail.MessagingException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class UsersServiceImpl implements UsersService{

    private final SubscriptionsRepository subscriptionsRepository;

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    private final UsersRepository usersRepository;

    private final ImageUploadCloudinary imageUploadCloudinary;

    private final PasswordEncoder passwordEncoder;

    private final OneTimePasswordRepository oneTimePasswordRepository;

    private final EmailUtils emailUtils;

    public UsersServiceImpl(SubscriptionsRepository subscriptionsRepository, SubscriptionPlanRepository subscriptionPlanRepository, UsersRepository usersRepository, ImageUploadCloudinary imageUploadCloudinary, PasswordEncoder passwordEncoder, OneTimePasswordRepository oneTimePasswordRepository, EmailUtils emailUtils) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.usersRepository = usersRepository;
        this.imageUploadCloudinary = imageUploadCloudinary;
        this.passwordEncoder = passwordEncoder;
        this.oneTimePasswordRepository = oneTimePasswordRepository;
        this.emailUtils = emailUtils;
    }


    @Override
    public ResponseEntity<String> saveUser(UsersDto usersDto) {

        if(usersRepository.findByEmail(usersDto.getEmail()).isPresent()){
            throw new AlreadyExistsException("Email is already in use.");
        }

        SubscriptionPlan subscriptionPlan = subscriptionPlanRepository.findById("SUB_FREE").orElseThrow(
                ()-> new ResourceNotFoundException("Subscription Plan not found!!")
        );

        Subscriptions subscriptions = new Subscriptions();
        subscriptions.setSubscriptionsId(UUID.randomUUID().toString());
        subscriptions.setPlan(subscriptionPlan);
        subscriptions.setStartDate(LocalDate.now());
        subscriptions.setStatus(SubscriptionStatus.ACTIVE);
        subscriptions.setEndDate(LocalDate.now().plusDays(subscriptionPlan.getDurationInDays()));

        Users newUser = new Users();
        newUser.setUserId(UUID.randomUUID().toString());
        newUser.setEmail(usersDto.getEmail());
        newUser.setName(usersDto.getName());
        newUser.setRole(Role.OWNER);
        newUser.setPassword(passwordEncoder.encode(usersDto.getPassword()));
        newUser.setImageUrl(usersDto.getImageUrl());
        try{
            Users savedUser = usersRepository.save(newUser);
            subscriptions.setUser(savedUser);
            subscriptionsRepository.save(subscriptions);
            return new ResponseEntity<String>("User added Successfully", HttpStatus.OK);
        } catch (DataAccessException e) {
            throw new DatabaseOperationException("Failed to add User"+ e.getMessage());
        }

    }

    @Override
    public String uploadProfileImage(String userId, MultipartFile file) throws IOException {
        try{
            Users existingUser = usersRepository.findById(userId).orElseThrow(
                    ()-> new ResourceNotFoundException("User Not Found!")
            );

            // If user already has an existing profile image, delete it from Cloudinary
            if (existingUser.getImageUrl() != null) {
                deleteImageFromCloudinary(existingUser.getImageUrl());
            }

            String imageUrl = imageUploadCloudinary.uploadImage(file);
            existingUser.setImageUrl(imageUrl);
            usersRepository.save(existingUser);

            return imageUrl;
        }catch (IOException e){
            throw new FileUploadException("Failed to upload profile image.");
        }
    }

    @Override
    public String removeProfileImage(String userId) throws IOException {
        Users user = usersRepository.findById(userId).orElseThrow(
                ()-> new ResourceNotFoundException("User not Found!")
        );

        if (user.getImageUrl() == null) {
            throw new ImageNotFoundException("No profile image found...");

        }
        try{
            deleteImageFromCloudinary(user.getImageUrl());

            // Set profile image URL to null in the database
            user.setImageUrl(null);
            usersRepository.save(user);

            return "Profile image removed successfully!";
        } catch (IOException e) {
            throw new FileDeleteException("Failed to remove profile image.");
        }
    }

    @Override
    public String updateUserPassword(String userId, PasswordDto passwordDto) {
        Users users = usersRepository.findById(userId).orElseThrow(
                ()-> new ResourceNotFoundException("User Not Found!")
        );

        if(!passwordEncoder.matches(passwordDto.getOldPassword(),users.getPassword())){
            throw new InvalidPasswordException("Old Password does not match...");
        }

        users.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        usersRepository.save(users);

        return "Password Updated Successfully!!";
    }

    @Override
    public String forgotPassword(String email) throws MessagingException {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email"));

        OneTimePassword oneTimePassword = oneTimePasswordRepository.getOtpByUserId(user.getUserId());
        if (oneTimePassword == null) {
            oneTimePassword = new OneTimePassword();
            oneTimePassword.setId(UUID.randomUUID().toString());
        }

        final int OTP_VALIDITY_MINUTES = 5;
        String otpValue = generateOtp();

        oneTimePassword.setUsers(user);
        oneTimePassword.setExpirationTime(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        oneTimePassword.setOtpValue(otpValue);
        oneTimePasswordRepository.save(oneTimePassword);

        String emailBody = getOtpEmailTemplate(otpValue, OTP_VALIDITY_MINUTES);

        try{
            emailUtils.sendEmail(email, "Reset Your MyTaskly Password – OTP Inside!", emailBody);
            return "OTP sent successfully";
        } catch (MessagingException e) {
            throw new EmailSendException("Failed to send OTP email.");
        }
    }

    @Override
    public String verifyOtp(String email, String otp) {
        Users user = usersRepository.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("Invalid email address."));

        OneTimePassword storedOtp = oneTimePasswordRepository.getOtpByUserId(user.getUserId());
        if (storedOtp == null) {
            throw new OtpNotFoundException("OTP not found.");
        }

        if (!storedOtp.getOtpValue().equals(otp) && storedOtp.getExpirationTime().isAfter(LocalDateTime.now())) {
            throw new InvalidOtpException("Incorrect OTP or time has expired.");
        }

        return "OTP has been successfully verified.";
    }

    @Override
    public String setPassword(String email, String newPassword) {
        Users user = usersRepository.findByEmail(email).orElseThrow(
                ()->new ResourceNotFoundException("User not found.")
        );

        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepository.save(user);

        return "Password has been changed successfully.";
    }

    @Override
    public String updateUsername(String email, String username) {
        Users users = usersRepository.findByEmail(email).orElseThrow(
                ()-> new ResourceNotFoundException("User not Found!")
        );

        if(username == null || username.trim().isEmpty()){
            throw new InvalidInputException("New username cannot be empty.");
        }
        users.setName(username);
        try{
            usersRepository.save(users);
        } catch (DataAccessException e) {
            throw new DatabaseOperationException("Failed to update username");
        }
        return "Username updated successfully!";
    }

    @Override
    public Users getUserByUserId(String userId) {
        return usersRepository.findById(userId).orElseThrow(
                ()-> new ResourceNotFoundException("User not Found!!")
        );
    }

    @Override
    public String deleteUserByUserId(String userId) {
        Users users = usersRepository.findById(userId).orElseThrow(
                ()-> new ResourceNotFoundException("User not Found!!")
        );
        try{
            usersRepository.delete(users);
        }catch (DataAccessException e){
            throw new DatabaseOperationException("Failed to delete user...");
        }
        return "User deleted Successfully!!!!";
    }

    @Override
    public List<Users> getAllUsers() {
        List<Users> usersList = usersRepository.findAll();

        if(usersList.isEmpty()){
            throw new ResourceNotFoundException("No Users Exists..");
        }
        return usersList;
    }

    @Override
    public List<String> getAllUsersExceptUserIdMatch(String email) {
        return usersRepository.getAllUsersExceptUserIdMatch(email);
    }

    /**
     * Helper function which gives and OTP Email Template
     * @param otp
     * @param validityMinutes
     * @return
     */
    private String getOtpEmailTemplate(String otp, int validityMinutes) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        max-width: 500px;
                        margin: auto;
                    }
                    .otp {
                        font-size: 24px;
                        font-weight: bold;
                        color: #2d89ff;
                    }
                    .button {
                        background-color: #2d89ff;
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin-top: 15px;
                        font-size: 16px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Reset Your Password</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your <strong>MyTaskly</strong> account. Use the OTP below to reset your password:</p>
                    <p class="otp">%s</p>
                    <p>This OTP is valid for <strong>%d minutes</strong>.</p>
                    <p>If you didn't request a password reset, please ignore this email. Your account is safe.</p>
                    <div class="footer">
                        <p>Best regards,</p>
                        <p><strong>MyTaskly Team</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """, otp, validityMinutes);
    }


    /**
     * Helper method to generate otp
     */
    private String generateOtp(){
        return String.valueOf(new Random().nextInt(900000) + 100000);
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
