package com.charan.mytaskly.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageUploadCloudinary {

    String uploadImage(MultipartFile file) throws IOException;

    String deleteImage(String publicId) throws IOException;

}
