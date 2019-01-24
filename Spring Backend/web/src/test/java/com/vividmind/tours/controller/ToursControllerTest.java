package com.vividmind.tours.controller;

import com.google.gson.Gson;
import com.vividmind.tours.service.TourService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.List;

@RunWith(SpringRunner.class)
@WebMvcTest(value = ToursController.class, secure = false)
public class ToursControllerTest {

    List<String> tours = new ArrayList<>();
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private TourService tourService;

    @Before
    public void setUp() {
        tours.add("London travels");
        tours.add("american travels");
        tours.add("london american usa");
    }

    @Test
    public void listToursWithUnknownFilter() throws Exception {
        Mockito.when(
                tourService.filterTourNames(Mockito.anyString())).thenReturn(tours);
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get(
                "/tours").accept(
                MediaType.ALL);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String response = result.getResponse().getContentAsString();

        Gson converter = new Gson();

        JSONAssert.assertEquals("[]", response, true);
    }

    @Test
    public void listToursWithoutFilter() throws Exception {
        Mockito.when(
                tourService.filterTourNames(null)).thenReturn(tours);
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get(
                "/tours").accept(
                MediaType.ALL);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String expected = "[\"London travels\",\"american travels\",\"london american usa\"]";
        JSONAssert.assertEquals(expected, result.getResponse()
                .getContentAsString(), true);
    }
}
