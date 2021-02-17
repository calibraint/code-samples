package com.vividmind.tours.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@RunWith(SpringRunner.class)
@WebMvcTest(value = AppController.class, secure = false)
public class AppControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void ping() throws Exception {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get(
                "/ping").accept(
                MediaType.ALL);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String expected = "{\"message\": \"pong\"}";
        JSONAssert.assertEquals(expected, result.getResponse()
                .getContentAsString(), true);
    }
}
