package com.websocket.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration Class
 *
 * This class configures our WebSocket setup using Spring's STOMP protocol support.
 *
 * Key Annotations:
 * - @Configuration: Marks this as a configuration class
 * - @EnableWebSocketMessageBroker: Enables WebSocket message handling with STOMP protocol
 *
 * STOMP (Simple Text Oriented Messaging Protocol):
 * - A simple protocol for messaging
 * - Works over WebSocket
 * - Provides publish-subscribe messaging (like subscribing to topics)
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Configure STOMP endpoints where clients will connect
     * Think of endpoints as "doors" where clients can enter our WebSocket world
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        /*
         * Register a STOMP endpoint at "/ws"
         * - This is where clients will connect: ws://localhost:8080/ws
         * - withSockJS() provides fallback options for browsers that don't support WebSocket
         * - SockJS automatically falls back to other transport methods if WebSocket fails
         * - setAllowedOriginPatterns("*") allows connections from any origin (for development)
         */
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // Allow all origins (be more restrictive in production!)
                .withSockJS();                  // Enable SockJS fallback

        System.out.println("🔧 WebSocket endpoint registered at /ws");
    }

    /**
     * Configure the message broker
     * A message broker routes messages between clients
     * Think of it as a post office that delivers messages to the right recipients
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        /*
         * Enable a simple in-memory message broker
         * - "/topic" prefix: for broadcasting messages to multiple subscribers
         *   Example: /topic/public (everyone subscribed to this topic gets messages)
         * - This is like a radio station - anyone tuned to the channel hears the broadcast
         */
        config.enableSimpleBroker("/topic");

        /*
         * Set application destination prefix
         * - "/app" prefix: for messages that are bound to methods annotated with @MessageMapping
         * - When client sends message to "/app/chat.sendMessage",
         *   it goes to a method with @MessageMapping("/chat.sendMessage")
         * - This is like addressing a letter to a specific department
         */
        config.setApplicationDestinationPrefixes("/app");

        System.out.println("🏢 Message broker configured:");
        System.out.println("   📡 Broadcast prefix: /topic");
        System.out.println("   📮 Application prefix: /app");
    }
}