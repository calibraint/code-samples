package com.vividmind.tours.service;

import com.vividmind.http.dto.TourList;
import com.vividmind.http.dto.TourResponse;
import com.vividmind.http.service.TourHttpService;
import com.vividmind.tours.model.entity.Tour;
import com.vividmind.tours.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import retrofit2.Response;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private TourHttpService tourHttpService;

    public List<String> filterTourNames(String filter) {
        List<Tour> tours = null;
        List<String> tourNames = new ArrayList<>();

        if (filter != null && !filter.isEmpty()) {
            tours = tourRepository.findByNameContainingIgnoreCase(filter);
        } else {
            tours = tourRepository.findAll();
        }

        if (tours.size() > 0) {
            for (Tour row : tours) {
                tourNames.add(row.getName());
            }
        }

        return tourNames;
    }

    public HttpStatus refreshTours(String filter) {
        try {
            Response response = tourHttpService.getTours();

            if (response.code() >= 300) {
                return HttpStatus.valueOf(response.code());
            }

            Response<TourResponse> tourResponse = response;

            List<TourList> tours = tourResponse.body() != null ? tourResponse.body().getTourLists() : Collections.emptyList();

            if (tours.size() > 0) {
                if (filter != null && !filter.isEmpty()) {
                    tours = tours.stream()
                            .filter(tourList -> tourList.getName().toLowerCase().contains(filter.toLowerCase()))
                            .collect(Collectors.toList());
                }

                if (tours.size() > 0) {
                    tourRepository.deleteAll();
                }

                for (TourList tourList :
                        tours) {
                    Tour tour = new Tour();
                    tour.setId(tourList.getId());
                    tour.setName(tourList.getName());
                    tour.setLongDesc(tourList.getLongDesc());
                    tourRepository.save(tour);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return HttpStatus.OK;
    }
}
