package com.smartcomplaint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("\n==========================================================================");
        System.out.println("🚀 Smart Customer Complaint & Resolution Management System Started!");
        System.out.println("🌐 Application URL: http://localhost:8080");
        System.out.println("📊 H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("==========================================================================\n");
    }
}
