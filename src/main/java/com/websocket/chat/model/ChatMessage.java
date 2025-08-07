package com.websocket.chat.model;

/**
 * ChatMessage - A data model representing a chat message
 * This is a Plain Old Java Object (POJO) that will be converted to/from JSON
 *
 * Key concepts:
 * - This class represents the structure of messages sent between client and server
 * - Jackson (JSON library) will automatically convert between Java objects and JSON
 * - We use an enum for message types to ensure type safety
 */
public class ChatMessage {

    /**
     * Enum defining different types of messages our chat system can handle
     * - CHAT: Regular chat messages between users
     * - JOIN: When a user joins the chat
     * - LEAVE: When a user leaves the chat
     */
    public enum MessageType {
        CHAT,   // Regular message
        JOIN,   // User joining
        LEAVE   // User leaving
    }

    // Private fields - following Java encapsulation principles
    private MessageType type;    // What kind of message is this?
    private String content;      // The actual message text
    private String sender;       // Who sent this message?
    private long timestamp;      // When was this message sent?

    /**
     * Default constructor - required for JSON deserialization
     * Jackson needs this to create objects from JSON
     */
    public ChatMessage() {
        this.timestamp = System.currentTimeMillis(); // Set current time
    }

    /**
     * Constructor with parameters - for creating messages programmatically
     */
    public ChatMessage(MessageType type, String content, String sender) {
        this.type = type;
        this.content = content;
        this.sender = sender;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters and Setters - required for JSON serialization/deserialization
    // Jackson uses these methods to convert between Java objects and JSON

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * toString method - useful for debugging and logging
     */
    @Override
    public String toString() {
        return String.format("ChatMessage{type=%s, content='%s', sender='%s', timestamp=%d}",
                type, content, sender, timestamp);
    }
}