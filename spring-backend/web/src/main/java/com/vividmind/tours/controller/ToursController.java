package com.vividmind.tours.controller;

import com.vividmind.tours.model.dto.Filter;
import com.vividmind.tours.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
public class ToursController {

    @Autowired
    TourService tourService;

    @RequestMapping(value = "/tours", method = RequestMethod.GET)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List> listTours(@RequestParam(value = "filter", required = false) String filter) {
        return new ResponseEntity<>(tourService.filterTourNames(filter), HttpStatus.OK);
    }

    @RequestMapping(value = "/tours/refresh", method = RequestMethod.POST)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HashMap> refreshTours(@RequestBody(required = false) Filter filter) {
        String query = null;

        if (filter != null) {
            query = filter.getFilter();
        }

        HttpStatus status = tourService.refreshTours(query);

        HashMap<String, Object> response = new HashMap<>();
        response.put("status", status.value());
        response.put("message", HttpStatus.valueOf(status.value()));

        return new ResponseEntity<>(response, status);
    }
}
