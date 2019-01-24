package com.vividmind.tours.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
public class AppController {

    @RequestMapping(value = "/ping", method = RequestMethod.GET)
    public ResponseEntity<HashMap> ping() {
        HashMap<String, String> pong = new HashMap<>();
        pong.put("message", "pong");

        return new ResponseEntity<>(pong, HttpStatus.OK);
    }
}
