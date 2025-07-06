package com.example.AuthLinsoft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableDiscoveryClient
public class AuthLinsoftApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthLinsoftApplication.class, args);
	}

}
