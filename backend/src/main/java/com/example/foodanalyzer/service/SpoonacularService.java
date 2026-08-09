package com.example.foodanalyzer.service;

import com.example.foodanalyzer.model.FoodAnalysisResponse;
import com.example.foodanalyzer.model.RecipeInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class SpoonacularService {

    @Value("${spoonacular.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public FoodAnalysisResponse fetchFoodDetails(String foodName) {
        return fetchFoodDetails(foodName, 85.0, List.of(foodName), "Global", "Global", "Meal", "1 Serving", "300g", "Fresh Prepared", false, false, List.of());
    }

    public FoodAnalysisResponse fetchFoodDetails(String foodName, double confidence, List<String> topCandidates,
                                                 String cuisine, String region, String category, String portionSize,
                                                 String estimatedWeight, String cookingMethod, boolean lowConfidence,
                                                 boolean userCorrected, List<String> customIngredients) {
        if (foodName == null || foodName.isBlank()) {
            foodName = "food";
        }

        String cleanedName = cleanFoodQuery(foodName);
        String query = URLEncoder.encode(cleanedName, StandardCharsets.UTF_8);
        String searchUrl = String.format(
                "https://api.spoonacular.com/recipes/complexSearch?query=%s&number=3&addRecipeInformation=true&apiKey=%s",
                query,
                apiKey);

        List<?> results = List.of();
        try {
            Map<?, ?> searchResult = restTemplate.getForObject(searchUrl, Map.class);
            results = searchResult != null ? (List<?>) searchResult.get("results") : List.of();
        } catch (Exception e) {
            // Handle API rate limits or network issues silently
        }

        if (results.isEmpty()) {
            return createFallbackResponse(foodName, confidence, topCandidates, cuisine, region, category, portionSize, estimatedWeight, cookingMethod, lowConfidence, userCorrected, customIngredients);
        }

        Map<?, ?> firstRecipe = (Map<?, ?>) results.get(0);
        Integer recipeId = firstRecipe.get("id") instanceof Number ? ((Number) firstRecipe.get("id")).intValue() : null;
        Map<?, ?> recipeInfo = firstRecipe;

        if (recipeId != null) {
            try {
                String infoUrl = String.format(
                        "https://api.spoonacular.com/recipes/%d/information?includeNutrition=true&apiKey=%s",
                        recipeId,
                        apiKey);
                Map<?, ?> fullInfo = restTemplate.getForObject(infoUrl, Map.class);
                if (fullInfo != null) {
                    recipeInfo = fullInfo;
                }
            } catch (Exception e) {
                // Keep firstRecipe fallback
            }
        }

        return buildResponse(foodName, confidence, topCandidates, cuisine, region, category, portionSize, estimatedWeight, cookingMethod, lowConfidence, userCorrected, customIngredients, recipeInfo, results);
    }

    private String cleanFoodQuery(String foodName) {
        return foodName.toLowerCase()
                .replaceAll("(?i)\\b(a|an|the|plate of|bowl of|dish of)\\b", "")
                .trim();
    }

    private FoodAnalysisResponse buildResponse(String foodName, double confidence, List<String> topCandidates,
                                                 String cuisine, String region, String category, String portionSize,
                                                 String estimatedWeight, String cookingMethod, boolean lowConfidence,
                                                 boolean userCorrected, List<String> customIngredients,
                                                 Map<?, ?> recipeInfo, List<?> results) {
        FoodAnalysisResponse response = new FoodAnalysisResponse();
        response.setPredictedFood(foodName);
        response.setConfidence(confidence);
        response.setTopCandidates(topCandidates != null && !topCandidates.isEmpty() ? topCandidates : List.of(foodName));
        response.setCuisine(cuisine != null ? cuisine : parseCuisine(recipeInfo));
        response.setRegion(region != null ? region : response.getCuisine() + " Region");
        response.setCategory(category != null ? category : "General Dish");
        response.setPortionSize(portionSize != null ? portionSize : "1 Serving");
        response.setEstimatedWeight(estimatedWeight != null ? estimatedWeight : "300g");
        response.setCookingMethod(cookingMethod != null ? cookingMethod : "Fresh Prepared");
        response.setLowConfidence(lowConfidence || confidence < 50.0);
        response.setUserCorrected(userCorrected);

        List<String> ingredients = (customIngredients != null && !customIngredients.isEmpty()) ? customIngredients : parseIngredients(recipeInfo);
        response.setIngredients(ingredients);
        response.setAllergens(detect13Allergens(ingredients, foodName));
        response.setRecipeSuggestions(parseRecipeSuggestions(results));
        response.setSourceUrl(parseSourceUrl(recipeInfo));
        response.setRecipes(parseRecipes(results));

        // Macronutrients
        double cal = findNutrientValue(recipeInfo, "Calories");
        double prot = findNutrientValue(recipeInfo, "Protein");
        double carbs = findNutrientValue(recipeInfo, "Carbohydrates");
        double fat = findNutrientValue(recipeInfo, "Fat");
        double fiber = findNutrientValue(recipeInfo, "Fiber");
        double sugar = findNutrientValue(recipeInfo, "Sugar");

        if (cal == 0) {
            double[] fallbacks = estimateNutrients(foodName);
            cal = fallbacks[0]; prot = fallbacks[1]; carbs = fallbacks[2]; fat = fallbacks[3];
            fiber = fallbacks[4]; sugar = fallbacks[5];
        }

        response.setCalories(cal);
        response.setProtein(prot);
        response.setCarbs(carbs);
        response.setFat(fat);
        response.setFiber(fiber);
        response.setSugar(sugar);
        response.setWater(round(150.0 + (cal * 0.2)));

        // Micronutrients
        response.setVitaminA(findNutrientValue(recipeInfo, "Vitamin A"));
        response.setVitaminC(findNutrientValue(recipeInfo, "Vitamin C"));
        response.setVitaminD(findNutrientValue(recipeInfo, "Vitamin D"));
        response.setIron(findNutrientValue(recipeInfo, "Iron"));
        response.setCalcium(findNutrientValue(recipeInfo, "Calcium"));
        response.setPotassium(findNutrientValue(recipeInfo, "Potassium"));
        response.setSodium(findNutrientValue(recipeInfo, "Sodium"));
        response.setZinc(findNutrientValue(recipeInfo, "Zinc"));

        // Health Score Breakdown
        buildHealthScoreBreakdown(response, cal, prot, carbs, fat, fiber, sugar, response.getSodium());
        response.setDietCompatibility(assessDietCompatibility(foodName, prot, carbs, fat, fiber, sugar, response.getAllergens()));

        return response;
    }

    private FoodAnalysisResponse createFallbackResponse(String foodName, double confidence, List<String> topCandidates,
                                                         String cuisine, String region, String category, String portionSize,
                                                         String estimatedWeight, String cookingMethod, boolean lowConfidence,
                                                         boolean userCorrected, List<String> customIngredients) {
        FoodAnalysisResponse response = new FoodAnalysisResponse();
        response.setPredictedFood(foodName);
        response.setConfidence(confidence);
        response.setTopCandidates(topCandidates != null && !topCandidates.isEmpty() ? topCandidates : List.of(foodName));
        response.setCuisine(cuisine != null ? cuisine : guessCuisine(foodName));
        response.setRegion(region != null ? region : response.getCuisine() + " Region");
        response.setCategory(category != null ? category : "General Dish");
        response.setPortionSize(portionSize != null ? portionSize : "1 Serving");
        response.setEstimatedWeight(estimatedWeight != null ? estimatedWeight : "300g");
        response.setCookingMethod(cookingMethod != null ? cookingMethod : "Fresh Prepared");
        response.setLowConfidence(lowConfidence || confidence < 50.0);
        response.setUserCorrected(userCorrected);

        List<String> ingredients = (customIngredients != null && !customIngredients.isEmpty()) ? customIngredients : List.of("Fresh local ingredients", "Spices", "Oil", "Seasoning");
        response.setIngredients(ingredients);
        response.setAllergens(detect13Allergens(ingredients, foodName));
        response.setRecipeSuggestions(List.of("Homemade " + foodName + " Recipe", "Traditional " + foodName + " Preparation"));
        response.setSourceUrl("");
        response.setRecipes(List.of());

        double[] nutrients = estimateNutrients(foodName);
        response.setCalories(nutrients[0]);
        response.setProtein(nutrients[1]);
        response.setCarbs(nutrients[2]);
        response.setFat(nutrients[3]);
        response.setFiber(nutrients[4]);
        response.setSugar(nutrients[5]);
        response.setWater(210.0);

        response.setVitaminA(140.0);
        response.setVitaminC(18.0);
        response.setVitaminD(2.5);
        response.setIron(2.6);
        response.setCalcium(70.0);
        response.setPotassium(360.0);
        response.setSodium(340.0);
        response.setZinc(1.9);

        buildHealthScoreBreakdown(response, nutrients[0], nutrients[1], nutrients[2], nutrients[3], nutrients[4], nutrients[5], 340.0);
        response.setDietCompatibility(assessDietCompatibility(foodName, nutrients[1], nutrients[2], nutrients[3], nutrients[4], nutrients[5], response.getAllergens()));

        return response;
    }

    private void buildHealthScoreBreakdown(FoodAnalysisResponse response, double cal, double prot, double carbs, double fat, double fiber, double sugar, double sodium) {
        int score = 75;
        List<String> positives = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        if (prot >= 14) { score += 8; positives.add("✓ High Protein (" + prot + "g)"); }
        else if (prot >= 8) { score += 4; positives.add("✓ Good Protein Source (" + prot + "g)"); }

        if (fiber >= 4.5) { score += 8; positives.add("✓ Excellent Dietary Fiber (" + fiber + "g)"); }
        else if (fiber >= 2.5) { score += 4; positives.add("✓ Moderate Fiber Content (" + fiber + "g)"); }

        if (sugar <= 5) { score += 6; positives.add("✓ Low Added Sugar (" + sugar + "g)"); }
        else if (sugar > 15) { score -= 12; warnings.add("⚠ High Added Sugar (" + sugar + "g)"); }

        if (sodium > 550) { score -= 10; warnings.add("⚠ High Sodium Content (" + Math.round(sodium) + "mg)"); }
        else { positives.add("✓ Controlled Sodium Level"); }

        if (fat > 22) { score -= 8; warnings.add("⚠ High Total Fats (" + fat + "g)"); }

        String procLevel = "Minimal Processing";
        if (fat > 18 || sodium > 500) procLevel = "Moderate Processing";
        if (sugar > 20 && fat > 20) procLevel = "Ultra-Processed";

        response.setProcessingLevel(procLevel);
        int finalScore = Math.max(15, Math.min(98, score));
        response.setHealthScore(finalScore);
        response.setHealthScoreRating(getRatingText(finalScore));

        if (positives.isEmpty()) positives.add("✓ Balanced Nutritional Profile");
        if (warnings.isEmpty()) warnings.add("✓ No Major Health Concerns Identified");

        response.setHealthPositiveChecks(positives);
        response.setHealthAttentionWarnings(warnings);
    }

    public List<String> detect13Allergens(List<String> ingredients, String foodName) {
        Set<String> allergens = new LinkedHashSet<>();
        String fullText = (foodName + " " + String.join(" ", ingredients)).toLowerCase();

        if (fullText.contains("milk") || fullText.contains("cheese") || fullText.contains("butter") || fullText.contains("cream") || fullText.contains("paneer") || fullText.contains("dahi") || fullText.contains("curd")) allergens.add("Milk / Dairy");
        if (fullText.contains("egg") || fullText.contains("mayo")) allergens.add("Egg");
        if (fullText.contains("peanut")) allergens.add("Peanut");
        if (fullText.contains("soy") || fullText.contains("tofu") || fullText.contains("edamame")) allergens.add("Soy");
        if (fullText.contains("fish") || fullText.contains("salmon") || fullText.contains("tuna")) allergens.add("Fish");
        if (fullText.contains("shrimp") || fullText.contains("crab") || fullText.contains("lobster") || fullText.contains("shellfish")) allergens.add("Shellfish");
        if (fullText.contains("almond") || fullText.contains("cashew") || fullText.contains("walnut") || fullText.contains("nut")) allergens.add("Tree Nuts");
        if (fullText.contains("wheat") || fullText.contains("flour") || fullText.contains("maida") || fullText.contains("gluten") || fullText.contains("bread") || fullText.contains("pasta") || fullText.contains("pav") || fullText.contains("bhatura") || fullText.contains("puri")) allergens.add("Gluten / Wheat");
        if (fullText.contains("sesame") || fullText.contains("tahini") || fullText.contains("til")) allergens.add("Sesame");
        if (fullText.contains("mustard") || fullText.contains("rai")) allergens.add("Mustard");
        if (fullText.contains("sulfite") || fullText.contains("wine")) allergens.add("Sulfites");

        return allergens.isEmpty() ? List.of("No major allergens detected") : new ArrayList<>(allergens);
    }

    public List<String> assessDietCompatibility(String foodName, double prot, double carbs, double fat, double fiber, double sugar, List<String> allergens) {
        List<String> diets = new ArrayList<>();
        String lower = foodName.toLowerCase();

        boolean hasMeat = lower.contains("chicken") || lower.contains("mutton") || lower.contains("beef") || lower.contains("pork") || lower.contains("fish") || lower.contains("shrimp");
        boolean hasDairy = allergens.contains("Milk / Dairy");
        boolean hasGluten = allergens.contains("Gluten / Wheat");

        if (!hasMeat) diets.add("Vegetarian");
        if (!hasMeat && !hasDairy && !allergens.contains("Egg")) diets.add("Vegan");
        if (carbs <= 15 && fat >= 12) diets.add("Keto Friendly");
        if (carbs <= 30) diets.add("Low Carb");
        if (sugar <= 8 && carbs <= 35) diets.add("Diabetic Friendly");
        if (!hasGluten) diets.add("Gluten Free");
        if (!hasDairy) diets.add("Lactose Free");
        if (prot >= 18) diets.add("High Protein");
        if (fat <= 8) diets.add("Low Fat");
        if (!lower.contains("pork") && !lower.contains("alcohol")) diets.add("Halal Friendly");

        return diets.isEmpty() ? List.of("Balanced Diet") : diets;
    }

    private String getRatingText(int score) {
        if (score >= 80) return "Excellent";
        if (score >= 65) return "Good";
        if (score >= 50) return "Average";
        return "Poor";
    }

    private String guessCuisine(String foodName) {
        String lower = foodName.toLowerCase();
        if (lower.contains("vada") || lower.contains("pav") || lower.contains("dosa") || lower.contains("idli") || lower.contains("samosa") || lower.contains("chole") || lower.contains("rajma") || lower.contains("biryani") || lower.contains("poha") || lower.contains("upma") || lower.contains("dhokla") || lower.contains("jamun") || lower.contains("paneer") || lower.contains("dal")) return "Indian";
        if (lower.contains("pizza") || lower.contains("pasta") || lower.contains("risotto")) return "Italian";
        if (lower.contains("sushi") || lower.contains("ramen") || lower.contains("gyoza")) return "Japanese";
        if (lower.contains("taco") || lower.contains("burrito") || lower.contains("quesadilla")) return "Mexican";
        if (lower.contains("burger") || lower.contains("fries") || lower.contains("bbq")) return "American";
        if (lower.contains("pad thai")) return "Thai";
        if (lower.contains("dumpling") || lower.contains("fried rice")) return "Chinese";
        return "Global";
    }

    private double[] estimateNutrients(String foodName) {
        String lower = foodName.toLowerCase();
        // [Calories, Protein, Carbs, Fat, Fiber, Sugar]
        if (lower.contains("vada pav")) return new double[]{290.0, 7.5, 42.0, 10.5, 3.8, 3.2};
        if (lower.contains("pav bhaji")) return new double[]{380.0, 9.0, 52.0, 16.0, 5.2, 5.5};
        if (lower.contains("misal pav")) return new double[]{420.0, 14.0, 48.0, 18.0, 7.0, 4.0};
        if (lower.contains("masala dosa") || lower.contains("dosa")) return new double[]{310.0, 6.5, 48.0, 10.0, 4.0, 2.5};
        if (lower.contains("idli")) return new double[]{180.0, 7.0, 34.0, 2.0, 4.5, 2.0};
        if (lower.contains("samosa")) return new double[]{260.0, 4.5, 28.0, 14.0, 2.5, 2.0};
        if (lower.contains("pani puri")) return new double[]{160.0, 3.0, 26.0, 5.0, 2.0, 3.5};
        if (lower.contains("chole bhature")) return new double[]{520.0, 16.0, 68.0, 22.0, 8.5, 4.5};
        if (lower.contains("rajma chawal")) return new double[]{410.0, 15.0, 65.0, 9.0, 9.0, 3.0};
        if (lower.contains("dal makhani") || lower.contains("dal tadka") || lower.contains("dal")) return new double[]{260.0, 11.0, 32.0, 9.0, 6.0, 2.0};
        if (lower.contains("paneer")) return new double[]{280.0, 18.0, 8.0, 19.0, 1.5, 2.5};
        if (lower.contains("butter chicken")) return new double[]{450.0, 28.0, 14.0, 32.0, 2.0, 5.0};
        if (lower.contains("biryani")) return new double[]{460.0, 24.0, 56.0, 16.0, 3.5, 2.0};
        if (lower.contains("poha")) return new double[]{220.0, 4.5, 38.0, 6.0, 3.0, 2.2};
        if (lower.contains("upma")) return new double[]{210.0, 5.0, 36.0, 5.5, 3.2, 1.5};
        if (lower.contains("dhokla")) return new double[]{160.0, 6.0, 24.0, 4.0, 3.0, 4.0};
        if (lower.contains("gulab jamun") || lower.contains("jalebi")) return new double[]{290.0, 3.5, 46.0, 11.0, 0.5, 36.0};
        return new double[]{250.0, 12.0, 30.0, 9.0, 2.8, 3.0};
    }

    private String parseCuisine(Map<?, ?> recipeInfo) {
        if (recipeInfo == null) return "Global";
        Object cuisinesObj = recipeInfo.get("cuisines");
        List<?> cuisines = cuisinesObj instanceof List<?> list ? list : List.of();
        return cuisines.isEmpty() ? "Global" : String.join(", ", cuisines.stream().map(Object::toString).toList());
    }

    private List<String> parseIngredients(Map<?, ?> recipeInfo) {
        if (recipeInfo == null) return List.of();
        List<String> ingredients = new ArrayList<>();
        Object ingredientsObj = recipeInfo.get("extendedIngredients");
        List<?> extendedIngredients = ingredientsObj instanceof List<?> list ? list : List.of();

        for (Object ingredientObj : extendedIngredients) {
            if (ingredientObj instanceof Map<?, ?> ingredientMap) {
                Object name = ingredientMap.get("originalString");
                if (name != null) {
                    ingredients.add(name.toString());
                }
            }
        }
        return ingredients.isEmpty() ? List.of("Fresh local ingredients", "Seasoning", "Spices") : ingredients;
    }

    private List<String> parseRecipeSuggestions(List<?> results) {
        List<String> suggestions = new ArrayList<>();
        for (Object result : results) {
            if (result instanceof Map<?, ?> recipeMap) {
                Object title = recipeMap.get("title");
                if (title != null) suggestions.add(title.toString());
            }
        }
        return suggestions.isEmpty() ? List.of("Chef's Special Recipe", "Classic Preparation Method") : suggestions;
    }

    private String parseSourceUrl(Map<?, ?> recipeInfo) {
        if (recipeInfo == null) return "";
        Object url = recipeInfo.get("sourceUrl");
        return url != null ? url.toString() : "";
    }

    private List<RecipeInfo> parseRecipes(List<?> results) {
        List<RecipeInfo> recipes = new ArrayList<>();
        for (Object result : results) {
            if (result instanceof Map<?, ?> recipeMap) {
                RecipeInfo recipe = new RecipeInfo();
                Object titleObj = recipeMap.get("title");
                Object imageObj = recipeMap.get("image");
                Object sourceUrlObj = recipeMap.get("sourceUrl");
                recipe.setTitle(titleObj != null ? titleObj.toString() : "Recipe");
                recipe.setImage(imageObj != null ? imageObj.toString() : "");
                recipe.setSourceUrl(sourceUrlObj != null ? sourceUrlObj.toString() : "");
                recipes.add(recipe);
            }
            if (recipes.size() >= 3) break;
        }
        return recipes;
    }

    private double findNutrientValue(Map<?, ?> recipeInfo, String nutrientName) {
        if (recipeInfo == null) return 0;
        Object nutritionObj = recipeInfo.get("nutrition");
        Map<?, ?> nutrition = nutritionObj instanceof Map<?, ?> map ? map : Map.of();
        Object nutrientsObj = nutrition.get("nutrients");
        List<?> nutrients = nutrientsObj instanceof List<?> list ? list : List.of();

        for (Object nutrientObj : nutrients) {
            if (nutrientObj instanceof Map<?, ?> nutrientMap) {
                Object name = nutrientMap.get("name");
                if (nutrientName.equalsIgnoreCase(String.valueOf(name))) {
                    Object amount = nutrientMap.get("amount");
                    return amount instanceof Number ? ((Number) amount).doubleValue() : 0;
                }
            }
        }
        return 0;
    }

    private double round(double val) {
        return Math.round(val * 10.0) / 10.0;
    }
}
