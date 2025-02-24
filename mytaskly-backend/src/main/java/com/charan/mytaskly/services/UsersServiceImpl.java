package com.charan.mytaskly.services;

import com.charan.mytaskly.dto.PasswordDto;
import com.charan.mytaskly.dto.UsersDto;
import com.charan.mytaskly.emailconfigurations.EmailUtils;
import com.charan.mytaskly.entities.OneTimePassword;
import com.charan.mytaskly.entities.Role;
import com.charan.mytaskly.entities.Users;
import com.charan.mytaskly.repository.OneTimePasswordRepository;
import com.charan.mytaskly.repository.UsersRepository;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UsersServiceImpl implements UsersService{

    private final UsersRepository usersRepository;

    private final ImageUploadCloudinary imageUploadCloudinary;

    private final PasswordEncoder passwordEncoder;

    private final OneTimePasswordRepository oneTimePasswordRepository;

    private final EmailUtils emailUtils;

    public UsersServiceImpl(UsersRepository usersRepository, ImageUploadCloudinary imageUploadCloudinary, PasswordEncoder passwordEncoder, OneTimePasswordRepository oneTimePasswordRepository, EmailUtils emailUtils) {
        this.usersRepository = usersRepository;
        this.imageUploadCloudinary = imageUploadCloudinary;
        this.passwordEncoder = passwordEncoder;
        this.oneTimePasswordRepository = oneTimePasswordRepository;
        this.emailUtils = emailUtils;
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
            return imageUrl;
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

    @Override
    public String updateUserPassword(String userId, PasswordDto passwordDto) {
        Optional<Users> existingUser = usersRepository.findById(userId);
        if (existingUser.isPresent()) {
            Users users = existingUser.get();
            if(passwordEncoder.matches(passwordDto.getOldPassword(),users.getPassword())){
                String newHashedPassword = passwordEncoder.encode(passwordDto.getNewPassword());
                users.setPassword(newHashedPassword);
                usersRepository.save(users);
                return "User Password Changed Successfully!!";
            }
            return "Password didn't match!!";
        }
        return "No User Found!!";
    }

    @Override
    public String forgotPassword(String email) throws MessagingException {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

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

        emailUtils.sendEmail(email, "Reset Your MyTaskly Password – OTP Inside!", emailBody);

        return "OTP sent successfully";
    }

    @Override
    public String verifyOtp(String email, String otp) {
        Users user = usersRepository.findByEmail(email).orElseThrow(()->new RuntimeException("Invalid email address."));

        OneTimePassword otpOptional = oneTimePasswordRepository.getOtpByUserId(user.getUserId());
        if (otpOptional == null) {
            return "OTP not found.";
        }

        if (otpOptional.getOtpValue().equals(otp) && otpOptional.getExpirationTime().isAfter(LocalDateTime.now())) {
            return "OTP has been successfully verified.";
        }
        return "Incorrect OTP or time has expired.";
    }

    @Override
    public String setPassword(String email, String newPassword) {
        Users user = usersRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found."));
        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepository.save(user);
        return "Password has been changed successfully.";
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
