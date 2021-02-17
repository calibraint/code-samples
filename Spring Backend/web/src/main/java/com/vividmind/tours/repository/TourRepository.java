package com.vividmind.tours.repository;

import com.vividmind.tours.model.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Integer> {

    List<Tour> findByNameContainingIgnoreCase(String name);
}
