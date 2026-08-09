package com.example.foodanalyzer.model;

import java.util.List;

public class FoodAnalysisResponse {

    private String predictedFood;
    private double confidence;
    private List<String> topCandidates;
    private String cuisine;
    private String region;
    private String category;
    private String portionSize;
    private String estimatedWeight;
    private String cookingMethod;
    private boolean lowConfidence;
    private boolean userCorrected;

    // Macronutrients
    private double calories;
    private double protein;
    private double carbs;
    private double fat;
    private double fiber;
    private double sugar;
    private double water;

    // Micronutrients
    private double vitaminA;
    private double vitaminC;
    private double vitaminD;
    private double iron;
    private double calcium;
    private double potassium;
    private double sodium;
    private double zinc;

    // AI Health Score & Transparent Breakdown
    private int healthScore;
    private String healthScoreRating;
    private String processingLevel;
    private List<String> healthPositiveChecks;
    private List<String> healthAttentionWarnings;

    // Allergen & Diet Compatibility
    private List<String> ingredients;
    private List<String> allergens;
    private List<String> dietCompatibility;

    // Recipes & Links
    private List<String> recipeSuggestions;
    private String sourceUrl;
    private List<RecipeInfo> recipes;

    public String getPredictedFood() {
        return predictedFood;
    }

    public void setPredictedFood(String predictedFood) {
        this.predictedFood = predictedFood;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public List<String> getTopCandidates() {
        return topCandidates;
    }

    public void setTopCandidates(List<String> topCandidates) {
        this.topCandidates = topCandidates;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPortionSize() {
        return portionSize;
    }

    public void setPortionSize(String portionSize) {
        this.portionSize = portionSize;
    }

    public String getEstimatedWeight() {
        return estimatedWeight;
    }

    public void setEstimatedWeight(String estimatedWeight) {
        this.estimatedWeight = estimatedWeight;
    }

    public String getCookingMethod() {
        return cookingMethod;
    }

    public void setCookingMethod(String cookingMethod) {
        this.cookingMethod = cookingMethod;
    }

    public boolean isLowConfidence() {
        return lowConfidence;
    }

    public void setLowConfidence(boolean lowConfidence) {
        this.lowConfidence = lowConfidence;
    }

    public boolean isUserCorrected() {
        return userCorrected;
    }

    public void setUserCorrected(boolean userCorrected) {
        this.userCorrected = userCorrected;
    }

    public double getCalories() {
        return calories;
    }

    public void setCalories(double calories) {
        this.calories = calories;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getCarbs() {
        return carbs;
    }

    public void setCarbs(double carbs) {
        this.carbs = carbs;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getFiber() {
        return fiber;
    }

    public void setFiber(double fiber) {
        this.fiber = fiber;
    }

    public double getSugar() {
        return sugar;
    }

    public void setSugar(double sugar) {
        this.sugar = sugar;
    }

    public double getWater() {
        return water;
    }

    public void setWater(double water) {
        this.water = water;
    }

    public double getVitaminA() {
        return vitaminA;
    }

    public void setVitaminA(double vitaminA) {
        this.vitaminA = vitaminA;
    }

    public double getVitaminC() {
        return vitaminC;
    }

    public void setVitaminC(double vitaminC) {
        this.vitaminC = vitaminC;
    }

    public double getVitaminD() {
        return vitaminD;
    }

    public void setVitaminD(double vitaminD) {
        this.vitaminD = vitaminD;
    }

    public double getIron() {
        return iron;
    }

    public void setIron(double iron) {
        this.iron = iron;
    }

    public double getCalcium() {
        return calcium;
    }

    public void setCalcium(double calcium) {
        this.calcium = calcium;
    }

    public double getPotassium() {
        return potassium;
    }

    public void setPotassium(double potassium) {
        this.potassium = potassium;
    }

    public double getSodium() {
        return sodium;
    }

    public void setSodium(double sodium) {
        this.sodium = sodium;
    }

    public double getZinc() {
        return zinc;
    }

    public void setZinc(double zinc) {
        this.zinc = zinc;
    }

    public int getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(int healthScore) {
        this.healthScore = healthScore;
    }

    public String getHealthScoreRating() {
        return healthScoreRating;
    }

    public void setHealthScoreRating(String healthScoreRating) {
        this.healthScoreRating = healthScoreRating;
    }

    public String getProcessingLevel() {
        return processingLevel;
    }

    public void setProcessingLevel(String processingLevel) {
        this.processingLevel = processingLevel;
    }

    public List<String> getHealthPositiveChecks() {
        return healthPositiveChecks;
    }

    public void setHealthPositiveChecks(List<String> healthPositiveChecks) {
        this.healthPositiveChecks = healthPositiveChecks;
    }

    public List<String> getHealthAttentionWarnings() {
        return healthAttentionWarnings;
    }

    public void setHealthAttentionWarnings(List<String> healthAttentionWarnings) {
        this.healthAttentionWarnings = healthAttentionWarnings;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public List<String> getAllergens() {
        return allergens;
    }

    public void setAllergens(List<String> allergens) {
        this.allergens = allergens;
    }

    public List<String> getDietCompatibility() {
        return dietCompatibility;
    }

    public void setDietCompatibility(List<String> dietCompatibility) {
        this.dietCompatibility = dietCompatibility;
    }

    public List<String> getRecipeSuggestions() {
        return recipeSuggestions;
    }

    public void setRecipeSuggestions(List<String> recipeSuggestions) {
        this.recipeSuggestions = recipeSuggestions;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public List<RecipeInfo> getRecipes() {
        return recipes;
    }

    public void setRecipes(List<RecipeInfo> recipes) {
        this.recipes = recipes;
    }
}
