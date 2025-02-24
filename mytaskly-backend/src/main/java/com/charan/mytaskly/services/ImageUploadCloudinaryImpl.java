package com.charan.mytaskly.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadCloudinaryImpl implements ImageUploadCloudinary{

    private final Cloudinary cloudinary;

    public ImageUploadCloudinaryImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "profile_images",
                    "resource_type", "image"
            ));

        return uploadResult.get("secure_url").toString();
    }

    @Override
    public String deleteImage(String publicId) throws IOException {
        String fullPublicId = "profile_images/" + publicId;
        Map result = cloudinary.uploader().destroy(fullPublicId, ObjectUtils.emptyMap());
        return result.get("result").toString();
    }

}
