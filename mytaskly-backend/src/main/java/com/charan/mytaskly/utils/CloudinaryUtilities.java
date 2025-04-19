package com.charan.mytaskly.utils;

import com.charan.mytaskly.services.ImageUploadCloudinary;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CloudinaryUtilities {

    private final ImageUploadCloudinary imageUploadCloudinary;

    public CloudinaryUtilities(ImageUploadCloudinary imageUploadCloudinary) {
        this.imageUploadCloudinary = imageUploadCloudinary;
    }

    /**
     * Helper method to extract public ID from Cloudinary URL and delete the image
     */
    public void deleteImageFromCloudinary(String imageUrl) throws IOException {
        String publicId = extractPublicIdFromUrl(imageUrl);

        if (publicId != null) {
            String data = imageUploadCloudinary.deleteImage(publicId);
        }
    }

    /**
     * Extracts public ID from Cloudinary image URL
     */
    public String extractPublicIdFromUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("/")) {
            return null;
        }

        String publicIdWithExtension = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        return publicIdWithExtension.split("\\.")[0]; // Remove file extension
    }
}
