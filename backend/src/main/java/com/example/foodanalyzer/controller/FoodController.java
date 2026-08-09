package com.example.foodanalyzer.controller;

import com.example.foodanalyzer.model.FoodAnalysisResponse;
import com.example.foodanalyzer.model.FoodHistory;
import com.example.foodanalyzer.model.GoalTracker;
import com.example.foodanalyzer.service.FoodService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/food")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:*}")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<FoodAnalysisResponse> analyzeFood(@RequestParam("image") MultipartFile image) {
        try {
            FoodAnalysisResponse response = foodService.analyzeFood(image);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/correct")
    public ResponseEntity<FoodAnalysisResponse> correctFood(@RequestBody Map<String, String> body) {
        String correctedName = body.getOrDefault("food_name", "Vada Pav");
        FoodAnalysisResponse response = foodService.correctFoodPrediction(correctedName);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/barcode")
    public ResponseEntity<FoodAnalysisResponse> analyzeBarcode(@RequestBody Map<String, String> body) {
        String barcode = body.getOrDefault("barcode", "8901058852319");
        FoodAnalysisResponse response = foodService.analyzeBarcode(barcode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/ocr")
    public ResponseEntity<FoodAnalysisResponse> analyzeOcr(@RequestParam("image") MultipartFile image) {
        try {
            FoodAnalysisResponse response = foodService.analyzeOcr(image);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> askAiChat(@RequestBody Map<String, String> body) {
        String question = body.getOrDefault("question", "Is Vada Pav healthy?");
        Map<String, String> response = foodService.askAiAssistant(question);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<FoodHistory>> getHistory() {
        return ResponseEntity.ok(foodService.getHistory());
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        foodService.deleteHistory(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/goals")
    public ResponseEntity<GoalTracker> getGoals() {
        GoalTracker defaultGoal = new GoalTracker("Weight Loss", 2000, 1420, 150, 95, 220, 140, 65, 42, 3.0, 2.1);
        return ResponseEntity.ok(defaultGoal);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(@RequestParam(defaultValue = "csv") String format) {
        StringBuilder csvContent = new StringBuilder();
        csvContent.append("ID,Food Name,Calories,Cuisine,Date\n");
        List<FoodHistory> histories = foodService.getHistory();
        for (FoodHistory h : histories) {
            csvContent.append(h.getId()).append(",")
                      .append(h.getFoodName()).append(",")
                      .append(h.getCalories()).append(",")
                      .append(h.getCuisine()).append(",")
                      .append(h.getCreatedAt()).append("\n");
        }

        byte[] bytes = csvContent.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=food_nutrition_report.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }
}
