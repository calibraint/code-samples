package com.vividmind.tours;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.vividmind")
public class ToursApplication {

    public static void main(String[] args) {
        SpringApplication.run(ToursApplication.class, args);
    }
}
