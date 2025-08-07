package com.websocket.chat.controller;

import com.websocket.chat.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

/**
 * ChatController - Handles WebSocket messages
 *
 * This controller processes incoming WebSocket messages and broadcasts responses.
 *
 * Key Annotations:
 * - @Controller: Marks this as a Spring MVC controller
 * - @MessageMapping: Maps WebSocket messages to handler methods (like @RequestMapping for HTTP)
 * - @SendTo: Automatically sends the return value to specified destination
 * - @Payload: Extracts the message payload (the actual data)
 */
@Controller
public class ChatController {

    /**
     * Handle chat messages sent by users
     *
     * Flow:
     * 1. Client sends message to "/app/chat.sendMessage"
     * 2. This method processes it
     * 3. @SendTo automatically broadcasts result to "/topic/public"
     * 4. All clients subscribed to "/topic/public" receive the message
     *
     * @param chatMessage The message sent by the client
     * @return The same message (will be broadcast to all subscribers)
     */
    @MessageMapping("/chat.sendMessage")  // Listens to: /app/chat.sendMessage
    @SendTo("/topic/public")              // Broadcasts to: /topic/public
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        /*
         * Log the received message (helpful for debugging)
         * In a real application, you might:
         * - Save the message to a database
         * - Perform content filtering
         * - Add metadata like server timestamp
         * - Implement user authentication
         */
        System.out.println("💬 Message received: " + chatMessage);

        /*
         * For now, we simply return the message as-is
         * Spring will automatically:
         * 1. Convert this ChatMessage object to JSON
         * 2. Send it to all clients subscribed to "/topic/public"
         */
        return chatMessage;
    }

    /**
     * Handle user joining the chat
     *
     * Flow:
     * 1. Client sends join message to "/app/chat.addUser"
     * 2. We store the username in the WebSocket session
     * 3. Create a JOIN message and broadcast it
     * 4. All clients see that a new user joined
     *
     * @param chatMessage Contains the username of the joining user
     * @param headerAccessor Provides access to message headers and session attributes
     * @return JOIN message to broadcast to all users
     */
    @MessageMapping("/chat.addUser")     // Listens to: /app/chat.addUser
    @SendTo("/topic/public")             // Broadcasts to: /topic/public
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {

        /*
         * Store username in WebSocket session attributes
         * This allows us to access the username later (e.g., when user disconnects)
         * Think of session attributes as a small storage space for each connected client
         */
        String username = chatMessage.getSender();
        headerAccessor.getSessionAttributes().put("username", username);

        System.out.println("👋 User joining: " + username);

        /*
         * Create a system message announcing the new user
         * This will be broadcast to all connected clients
         */
        ChatMessage joinMessage = new ChatMessage();
        joinMessage.setType(ChatMessage.MessageType.JOIN);
        joinMessage.setSender(username);
        joinMessage.setContent(username + " joined the chat!");

        return joinMessage;
    }

    /**
     * Optional: Handle user leaving (disconnect)
     * Note: This would typically be handled by a WebSocket event listener
     * for actual disconnect events, but this shows how you could handle explicit leave messages
     */
    @MessageMapping("/chat.removeUser")  // Listens to: /app/chat.removeUser
    @SendTo("/topic/public")             // Broadcasts to: /topic/public
    public ChatMessage removeUser(@Payload ChatMessage chatMessage) {
        System.out.println("👋 User leaving: " + chatMessage.getSender());

        /*
         * Create a system message announcing the user left
         */
        ChatMessage leaveMessage = new ChatMessage();
        leaveMessage.setType(ChatMessage.MessageType.LEAVE);
        leaveMessage.setSender(chatMessage.getSender());
        leaveMessage.setContent(chatMessage.getSender() + " left the chat!");

        return leaveMessage;
    }
}