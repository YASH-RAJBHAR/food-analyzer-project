package com.example.foodanalyzer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import com.example.foodanalyzer.helper.MultipartInputStreamFileResource;

@Service
public class FoodService {

    private final String PYTHON_API = "http://127.0.0.1:5001/predict";

    @Value("${spoonacular.api.key}")
    private String apiKey;

    public String analyze(MultipartFile file) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image",
                    new MultipartInputStreamFileResource(
                            file.getInputStream(),
                            file.getOriginalFilename()
                    ));

            HttpEntity<MultiValueMap<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(PYTHON_API, request, String.class);

            String responseBody = response.getBody();

            if (responseBody == null || responseBody.isEmpty()) {
                return "{\"error\":\"No response from AI model\"}";
            }

            String foodName = responseBody
                    .replaceAll("[^a-zA-Z]", "")
                    .toLowerCase();

            String url = "https://api.spoonacular.com/recipes/guessNutrition?title="
                    + foodName + "&apiKey=" + apiKey;

            ResponseEntity<String> nutritionResponse =
                    restTemplate.getForEntity(url, String.class);

            return nutritionResponse.getBody();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }
}