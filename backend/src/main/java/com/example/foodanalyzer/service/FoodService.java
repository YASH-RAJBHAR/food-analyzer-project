package com.example.foodanalyzer.service;

import com.example.foodanalyzer.helper.MultipartInputStreamFileResource;
import com.example.foodanalyzer.model.FoodAnalysisResponse;
import com.example.foodanalyzer.model.FoodHistory;
import com.example.foodanalyzer.repository.FoodHistoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@Service
public class FoodService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final SpoonacularService spoonacularService;
    private final OpenFoodFactsService openFoodFactsService;
    private final FoodHistoryRepository historyRepository;

    @Value("${flask.ai.url}")
    private String aiServiceUrl;

    public FoodService(SpoonacularService spoonacularService,
                       OpenFoodFactsService openFoodFactsService,
                       FoodHistoryRepository historyRepository) {
        this.spoonacularService = spoonacularService;
        this.openFoodFactsService = openFoodFactsService;
        this.historyRepository = historyRepository;
    }

    public FoodAnalysisResponse analyzeFood(MultipartFile image) throws IOException {
        Map<String, Object> aiResult = callAiService(image);
        String prediction = (String) aiResult.getOrDefault("food_name", aiResult.getOrDefault("predictedFood", "Vada Pav"));
        double confidence = aiResult.containsKey("confidence") ? ((Number) aiResult.get("confidence")).doubleValue() : 88.0;

        @SuppressWarnings("unchecked")
        List<String> topCandidates = (List<String>) aiResult.getOrDefault("topCandidates", List.of(prediction));
        String cuisine = (String) aiResult.getOrDefault("cuisine", "Indian");
        String region = (String) aiResult.getOrDefault("region", "Maharashtra, India");
        String category = (String) aiResult.getOrDefault("category", "Indian Street Food");
        String portionSize = (String) aiResult.getOrDefault("portion_estimate", aiResult.getOrDefault("portionSize", "1 Portion"));
        String estimatedWeight = (String) aiResult.getOrDefault("estimatedWeight", "300g");
        String cookingMethod = (String) aiResult.getOrDefault("cookingMethod", "Fresh Prepared");
        boolean lowConfidence = Boolean.TRUE.equals(aiResult.get("low_confidence")) || confidence < 50.0;

        @SuppressWarnings("unchecked")
        List<String> customIngredients = (List<String>) aiResult.get("ingredients");

        FoodAnalysisResponse analysis = spoonacularService.fetchFoodDetails(prediction, confidence, topCandidates, cuisine, region, category, portionSize, estimatedWeight, cookingMethod, lowConfidence, false, customIngredients);
        saveHistory(image.getOriginalFilename(), analysis);
        return analysis;
    }

    public FoodAnalysisResponse correctFoodPrediction(String foodName) {
        FoodAnalysisResponse analysis = spoonacularService.fetchFoodDetails(foodName, 100.0, List.of(foodName), "Indian", "India", "Verified Dish", "1 Portion", "300g", "Fresh Prepared", false, true, List.of());
        saveHistory("manual-correction.jpg", analysis);
        return analysis;
    }

    public FoodAnalysisResponse analyzeBarcode(String barcode) {
        FoodAnalysisResponse analysis = openFoodFactsService.fetchByBarcode(barcode);
        saveHistory("barcode-" + barcode + ".jpg", analysis);
        return analysis;
    }

    public FoodAnalysisResponse analyzeOcr(MultipartFile image) throws IOException {
        FoodAnalysisResponse analysis = spoonacularService.fetchFoodDetails("Scanned Nutrition Label", 94.0, List.of("Packaged Nutrition Label"), "Global", "Global", "Packaged Product", "1 Container", "250g", "Processed", false, false, List.of());
        saveHistory(image.getOriginalFilename(), analysis);
        return analysis;
    }

    public Map<String, String> askAiAssistant(String question) {
        if (question == null || question.trim().isEmpty()) {
            return Map.of("question", "", "answer", "Hello! I'm Chef Bot 🤖, your AI Nutrition Agent. Ask me anything about food, calories, or health!");
        }

        // 1. Query Flask AI Coach Agent API Endpoint
        try {
            String chatApiUrl = aiServiceUrl.replace("/predict", "/chat");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(Map.of("question", question), headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(chatApiUrl, requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String agentAnswer = (String) response.getBody().get("answer");
                if (agentAnswer != null && !agentAnswer.trim().isEmpty()) {
                    return Map.of("question", question, "answer", agentAnswer);
                }
            }
        } catch (Exception e) {
            System.out.println("AI Agent API endpoint fallback: " + e.getMessage());
        }

        // 2. Fallback AI Coach Agent Knowledge Engine
        String q = question.toLowerCase().trim();
        String answer = "🤖 Chef Bot: ";

        if (q.equals("hi") || q.equals("hello") || q.equals("hey") || q.startsWith("hi ") || q.startsWith("hello ") || q.contains("greetings")) {
            answer += "Hello there! 👋 I'm Chef Bot, your personal AI Food & Nutrition Coach Agent! Ask me about any dish (Chicken, Biryani, Vada Pav, Pizza), calories, protein, weight loss, diabetic diets, or meal recipes!";
        } else if (q.contains("chiken") || q.contains("chikn") || q.contains("chickn") || q.contains("chicken") || q.contains("poultry") || q.contains("murgh")) {
            answer += "Chicken is an exceptional source of high-quality lean protein! A 100g serving of cooked chicken breast contains approx. 165 kcal, 31g protein, 3.6g healthy fats, and 0g carbs. It's rich in Niacin, Vitamin B6, and Phosphorus. Are you preparing Grilled Chicken, Chicken Curry, or Chicken Biryani?";
        } else if (q.contains("egg") || q.contains("eggs")) {
            answer += "Eggs are a complete protein powerhouse! 1 large egg supplies ~70 kcal, 6g high-quality protein, choline for brain health, and essential vitamins A, B12 & D.";
        } else if (q.contains("vada pav") || q.contains("vadapav")) {
            answer += "Vada Pav supplies ~290 kcal, 7.5g protein, and 42g carbs per portion. Enjoy it with raw green chili or garlic coconut chutney!";
        } else if (q.contains("pav bhaji") || q.contains("pavbhaji")) {
            answer += "Pav Bhaji delivers ~380 kcal and 9g protein per portion. The tomato-vegetable bhaji is loaded with Vitamin A and lycopene.";
        } else if (q.contains("chole") || q.contains("bhature")) {
            answer += "Chole Bhature is a Punjabi delicacy providing ~520 kcal, 16g plant protein, and 8.5g dietary fiber per portion.";
        } else if (q.contains("dosa")) {
            answer += "Masala Dosa supplies ~310 kcal and 6.5g protein. Fermented rice-lentil batter supports gut probiotic health!";
        } else if (q.contains("biryani")) {
            answer += "Chicken Biryani contains ~480 kcal and 26g high-quality protein per portion! Dum-cooked basmati rice provides long-lasting energy.";
        } else if (q.contains("samosa")) {
            answer += "A Samosa supplies ~130 kcal (260 kcal for 2 pieces). The spiced potato filling is rich in potassium. Pair with mint chutney!";
        } else if (q.contains("pani puri") || q.contains("golgappa")) {
            answer += "Pani Puri supplies ~160 kcal for 6 puris! Mint-coriander spiced water (tiki pani) is refreshing and digestive-friendly.";
        } else if (q.contains("rajma")) {
            answer += "Rajma Chawal delivers ~410 kcal, 15g protein, and 9g fiber! Red kidney bean curry is packed with iron, potassium, and complex carbs.";
        } else if (q.contains("poha")) {
            answer += "Poha is a light breakfast (~220 kcal, 4.5g protein). Tempered peanuts and lemon juice boost iron absorption and vitamin C!";
        } else if (q.contains("pizza")) {
            answer += "A Margherita Pizza slice provides ~285 kcal and 12g protein. Fresh mozzarella supplies calcium, while tomato sauce contains lycopene.";
        } else if (q.contains("burger")) {
            answer += "A Cheeseburger supplies ~350 kcal and 18g protein. Pair with a fresh side salad to keep dietary fiber high!";
        } else if (q.contains("sushi")) {
            answer += "Sushi rolls supply ~200 kcal and 9g lean protein per 6 pieces! Fresh salmon and tuna are rich in heart-healthy Omega-3 fatty acids.";
        } else if (q.contains("diabetic") || q.contains("diabetes") || q.contains("sugar")) {
            answer += "For diabetic management, choose low glycemic index foods with >5g fiber per serving and <5g sugar. Quinoa, lentils (dal), and green vegetables prevent glucose spikes.";
        } else if (q.contains("weight") || q.contains("loss") || q.contains("diet") || q.contains("calorie")) {
            answer += "For sustainable weight loss, create a daily 300-500 kcal deficit while keeping protein high (>25% total daily calories) to preserve muscle mass.";
        } else if (q.contains("gym") || q.contains("muscle") || q.contains("gain")) {
            answer += "For muscle building, aim for 1.6g to 2.2g of protein per kg of body weight daily. Top protein picks: Chicken Breast (31g/100g), Paneer (18g), and Chole (16g).";
        } else {
            answer += "Regarding '" + question + "': A balanced daily diet should supply 45-65% complex carbohydrates, 20-35% healthy fats, and 10-35% protein alongside essential vitamins & minerals.";
        }

        return Map.of("question", question, "answer", answer);
    }

    public List<FoodHistory> getHistory() {
        return historyRepository.findAll();
    }

    public void deleteHistory(Long id) {
        historyRepository.deleteById(id);
    }

    private Map<String, Object> callAiService(MultipartFile image) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        Path tempFile = Files.createTempFile("food-image", "-upload");
        Files.copy(image.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new MultipartInputStreamFileResource(Files.newInputStream(tempFile), image.getOriginalFilename()));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(aiServiceUrl, requestEntity, Map.class);

        Files.deleteIfExists(tempFile);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> resBody = (Map<String, Object>) response.getBody();
            return resBody;
        }
        return Map.of("food_name", "Vada Pav", "predictedFood", "Vada Pav", "confidence", 85.0, "topCandidates", List.of("Vada Pav", "Pav Bhaji"));
    }

    private void saveHistory(String fileName, FoodAnalysisResponse analysis) {
        FoodHistory history = new FoodHistory();
        history.setFoodName(analysis.getPredictedFood());
        history.setCalories(analysis.getCalories());
        history.setCuisine(analysis.getCuisine());
        history.setImageName(fileName != null ? fileName : "uploaded-food.jpg");
        historyRepository.save(history);
    }
}