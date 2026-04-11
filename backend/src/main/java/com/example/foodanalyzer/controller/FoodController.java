package com.example.foodanalyzer.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import org.springframework.util.*;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;

import com.example.foodanalyzer.helper.MultipartInputStreamFileResource;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/food")
public class FoodController {

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeFood(@RequestParam("file") MultipartFile file) {
        try {
            String pythonApiUrl = "http://127.0.0.1:5001/predict";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image",
                new MultipartInputStreamFileResource(
                    file.getInputStream(),
                    file.getOriginalFilename()
                )
            );

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response =
                restTemplate.postForEntity(pythonApiUrl, requestEntity, String.class);

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // Test API
    @GetMapping("/test")
    public String test() {
        return "API Working";
    }
}