package com.vividmind.tours.service;

import com.vividmind.http.dto.TourList;
import com.vividmind.http.dto.TourResponse;
import com.vividmind.http.service.TourHttpService;
import com.vividmind.tours.model.entity.Tour;
import com.vividmind.tours.repository.TourRepository;
import okhttp3.ResponseBody;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringRunner;
import retrofit2.Response;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RunWith(SpringRunner.class)
@WebMvcTest(value = TourService.class, secure = false)
public class TourServiceTest {

    @Autowired
    TourService tourService;

    @MockBean
    TourRepository tourRepository;

    @MockBean
    TourHttpService tourHttpService;

    @Test
    public void TourServiceAutowired() {
        Assert.assertNotNull(tourService);
    }

    @Test
    public void filterTourNamesWithoutFilter() {
        Tour tour = new Tour();

        tour.setId(1);
        tour.setName("London");
        tour.setLongDesc("Lorem ipsum");
        List<Tour> allTours = Arrays.asList(tour);
        Mockito.when(tourRepository.findAll()).thenReturn(allTours);

        List<String> tours = tourService.filterTourNames(null);

        List<String> expected = new ArrayList<>();
        expected.add("London");

        Assert.assertEquals(expected, tours);
    }

    @Test
    public void filterTourNamesWithFilter() {
        Tour tour = new Tour();

        tour.setId(1);
        tour.setName("London");
        tour.setLongDesc("Lorem ipsum");

        List<Tour> tours = Arrays.asList(tour);

        Mockito.when(tourRepository.findByNameContainingIgnoreCase(tour.getName())).thenReturn(tours);

        List<String> tourList = tourService.filterTourNames("London");

        List<String> expected = new ArrayList<>();
        expected.add("London");

        Assert.assertEquals(expected, tourList);
    }

    @Test
    public void filterTourNamesWithFilterEmptyResponse() {
        Tour tour = new Tour();

        tour.setId(1);
        tour.setName("London");
        tour.setLongDesc("Lorem ipsum");

        List<Tour> tours = Arrays.asList(tour);

        Mockito.when(tourRepository.findByNameContainingIgnoreCase(tour.getName())).thenReturn(tours);

        List<String> tourList = tourService.filterTourNames("usa");

        List<String> expected = new ArrayList<>();
        expected.add("London");

        Assert.assertNotEquals(expected, tourList);
    }

    @Test
    public void refreshToursWithStatus200() throws IOException {
        TourList tourList = new TourList();
        tourList.setId(1);
        tourList.setName("London usa");
        tourList.setLongDesc("Lorem ipsum");

        TourList tourList1 = new TourList();
        tourList1.setId(2);
        tourList1.setName("australia");
        tourList1.setLongDesc(null);

        TourResponse tourResponse = new TourResponse();

        tourResponse.setTours(Arrays.asList(tourList, tourList1));
        Mockito.when(tourHttpService.getTours()).thenReturn(Response.success(200, tourResponse));

        HttpStatus status = tourService.refreshTours(null);

        Assert.assertEquals(200, status.value());
    }

    @Test
    public void refreshToursBadRequest() throws IOException {
        TourList tourList = new TourList();
        tourList.setId(1);
        tourList.setName("London usa");
        tourList.setLongDesc("Lorem ipsum");

        TourResponse tourResponse = new TourResponse();

        tourResponse.setTours(Arrays.asList(tourList));
        Mockito.when(tourHttpService.getTours()).thenReturn(Response.error(400, ResponseBody.create(null, "Bad Request")));

        HttpStatus status = tourService.refreshTours(null);

        Assert.assertEquals(400, status.value());
    }

    @Test
    public void refreshToursWithFilter() throws IOException {
        TourList tourList = new TourList();
        tourList.setId(1);
        tourList.setName("London usa");
        tourList.setLongDesc("Lorem ipsum");

        TourList tourList1 = new TourList();
        tourList1.setId(2);
        tourList1.setName("australia");
        tourList1.setLongDesc(null);

        TourList tourList2 = new TourList();
        tourList2.setId(3);
        tourList2.setName("india");
        tourList2.setLongDesc(null);

        TourResponse tourResponse = new TourResponse();

        tourResponse.setTours(Arrays.asList(tourList, tourList1, tourList2));
        Mockito.when(tourHttpService.getTours()).thenReturn(Response.success(200, tourResponse));


        HttpStatus status = tourService.refreshTours("india");

        Assert.assertEquals(200, status.value());
    }

    @Test
    public void refreshToursThrowsException() throws IOException {
        TourList tourList = new TourList();
        tourList.setId(1);
        tourList.setName("London usa");
        tourList.setLongDesc("Lorem ipsum");

        TourResponse tourResponse = new TourResponse();

        tourResponse.setTours(Arrays.asList(tourList));
        Mockito.when(tourHttpService.getTours()).thenThrow(IOException.class);

        HttpStatus status = tourService.refreshTours(null);

        Assert.assertEquals(500, status.value());
    }
}
