package com.student.analytics;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentPerformanceAnalyticsApplication {

    public static void main(String[] args) {
        configureDatabaseUrl();
        SpringApplication.run(StudentPerformanceAnalyticsApplication.class, args);
    }

    private static void configureDatabaseUrl() {
        String databaseUrl = System.getenv("DATABASE_URL");
        String explicitDbUrl = System.getenv("DB_URL");
        if (databaseUrl == null || databaseUrl.isBlank() || explicitDbUrl != null && !explicitDbUrl.isBlank()) {
            return;
        }

        URI uri = URI.create(databaseUrl);
        String userInfo = uri.getUserInfo();
        if (userInfo == null || !userInfo.contains(":")) {
            return;
        }

        String[] credentials = userInfo.split(":", 2);
        String port = uri.getPort() > 0 ? ":" + uri.getPort() : "";
        String query = uri.getQuery() == null ? "" : "?" + uri.getQuery();
        String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + port + uri.getPath() + query;

        System.setProperty("DB_URL", jdbcUrl);
        System.setProperty("DB_USERNAME", URLDecoder.decode(credentials[0], StandardCharsets.UTF_8));
        System.setProperty("DB_PASSWORD", URLDecoder.decode(credentials[1], StandardCharsets.UTF_8));
    }
}
