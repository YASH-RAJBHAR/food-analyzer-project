package com.example.foodanalyzer.repository;

import com.example.foodanalyzer.model.FoodHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodHistoryRepository extends JpaRepository<FoodHistory, Long> {
}
