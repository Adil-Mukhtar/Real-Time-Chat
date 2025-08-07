package com.websocket.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);

		System.out.println("🚀 WebSocket Chat Application is running!");
		System.out.println("📡 WebSocket endpoint: ws://localhost:8080/ws");
		System.out.println("🌐 Open your frontend to start chatting!");
	}

}
