package com.example.foodanalyzer.service;

import com.example.foodanalyzer.model.FoodAnalysisResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenFoodFactsService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final SpoonacularService spoonacularService;

    public OpenFoodFactsService(SpoonacularService spoonacularService) {
        this.spoonacularService = spoonacularService;
    }

    public FoodAnalysisResponse fetchByBarcode(String barcode) {
        String url = "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";
        try {
            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            if (response != null && Integer.valueOf(1).equals(response.get("status"))) {
                Map<?, ?> product = (Map<?, ?>) response.get("product");
                String name = product.get("product_name") != null ? product.get("product_name").toString() : "Scanned Item " + barcode;
                return spoonacularService.fetchFoodDetails(name, 98.0, List.of(name), "Global", "Global", "Packaged Product", "1 Unit", "250g", "Ready to Eat", false, false, List.of());
            }
        } catch (Exception e) {
            // fallback
        }
        return spoonacularService.fetchFoodDetails("Scanned Product (" + barcode + ")", 90.0, List.of("Scanned Item"), "Global", "Global", "Packaged Snack", "1 Package", "200g", "Ready to Eat", false, false, List.of());
    }
}
