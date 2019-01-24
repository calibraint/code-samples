package com.vividmind.http.dto;

import lombok.Data;

import java.util.List;

@Data
public class TourResponse {

    private List<TourList> tours;

    public List<TourList> getTourLists() {
        return tours;
    }

    public void setTourLists(List<TourList> tourLists) {
        this.tours = tourLists;
    }
}
