package com.example.foodanalyzer.model;

public class GoalTracker {

    private String goalType; // Weight Loss, Muscle Building, Weight Gain, Maintenance, Keto, Diabetic Control
    private double targetCalories;
    private double currentCalories;
    private double targetProtein;
    private double currentProtein;
    private double targetCarbs;
    private double currentCarbs;
    private double targetFat;
    private double currentFat;
    private double targetWaterLiters;
    private double currentWaterLiters;

    public GoalTracker() {
    }

    public GoalTracker(String goalType, double targetCalories, double currentCalories, double targetProtein, double currentProtein, double targetCarbs, double currentCarbs, double targetFat, double currentFat, double targetWaterLiters, double currentWaterLiters) {
        this.goalType = goalType;
        this.targetCalories = targetCalories;
        this.currentCalories = currentCalories;
        this.targetProtein = targetProtein;
        this.currentProtein = currentProtein;
        this.targetCarbs = targetCarbs;
        this.currentCarbs = currentCarbs;
        this.targetFat = targetFat;
        this.currentFat = currentFat;
        this.targetWaterLiters = targetWaterLiters;
        this.currentWaterLiters = currentWaterLiters;
    }

    public String getGoalType() {
        return goalType;
    }

    public void setGoalType(String goalType) {
        this.goalType = goalType;
    }

    public double getTargetCalories() {
        return targetCalories;
    }

    public void setTargetCalories(double targetCalories) {
        this.targetCalories = targetCalories;
    }

    public double getCurrentCalories() {
        return currentCalories;
    }

    public void setCurrentCalories(double currentCalories) {
        this.currentCalories = currentCalories;
    }

    public double getTargetProtein() {
        return targetProtein;
    }

    public void setTargetProtein(double targetProtein) {
        this.targetProtein = targetProtein;
    }

    public double getCurrentProtein() {
        return currentProtein;
    }

    public void setCurrentProtein(double currentProtein) {
        this.currentProtein = currentProtein;
    }

    public double getTargetCarbs() {
        return targetCarbs;
    }

    public void setTargetCarbs(double targetCarbs) {
        this.targetCarbs = targetCarbs;
    }

    public double getCurrentCarbs() {
        return currentCarbs;
    }

    public void setCurrentCarbs(double currentCarbs) {
        this.currentCarbs = currentCarbs;
    }

    public double getTargetFat() {
        return targetFat;
    }

    public void setTargetFat(double targetFat) {
        this.targetFat = targetFat;
    }

    public double getCurrentFat() {
        return currentFat;
    }

    public void setCurrentFat(double currentFat) {
        this.currentFat = currentFat;
    }

    public double getTargetWaterLiters() {
        return targetWaterLiters;
    }

    public void setTargetWaterLiters(double targetWaterLiters) {
        this.targetWaterLiters = targetWaterLiters;
    }

    public double getCurrentWaterLiters() {
        return currentWaterLiters;
    }

    public void setCurrentWaterLiters(double currentWaterLiters) {
        this.currentWaterLiters = currentWaterLiters;
    }
}
