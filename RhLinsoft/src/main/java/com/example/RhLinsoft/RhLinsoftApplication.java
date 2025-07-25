package com.example.RhLinsoft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;


;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableScheduling
public class RhLinsoftApplication {

//	@Value("${directory}")
//	private String directory;



   public static void main(String[] args) {
		SpringApplication.run(RhLinsoftApplication.class, args);
	}

}
