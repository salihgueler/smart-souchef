import { StyleSheet, ScrollView, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
//TODO: Add the AI imports here

//TODO Remove Mock AI responses after messages implemented
const mockAiResponses = [
  "That's an interesting point you've made.",
  "I understand what you're saying. Let me elaborate...",
  "Thanks for sharing your thoughts. Here's what I think...",
  "I'd be happy to help you with that.",
  "Could you please provide more details?",
  "Based on what you've said, I would suggest...",
];

// New component for empty state
const EmptyChat = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="chatbubble-ellipses-outline" size={64} color="#666" />
    <Text style={styles.emptyText}>No messages yet</Text>
    <Text style={styles.emptySubtext}>
      Start a conversation by typing a message below
    </Text>
  </View>
);

export default function TabOneScreen() {
  // TODO Add the useAiConversation hook here

  const [newMessage, setNewMessage] = useState("");

  //TODO Remove messages after messages implemented
  const [messages, setMessages] = useState<any[]>([]);

  //TODO Remove mock response generator after messages implemented
  const generateMockResponse = () => {
    const randomResponse =
      mockAiResponses[Math.floor(Math.random() * mockAiResponses.length)];
    return randomResponse;
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      //TODO add handleSendMessage here
      //TODO remove the message sending logic from here
      // Add user message
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: [{ text: newMessage.trim() }],
      };
      setMessages((prev) => [...prev, userMessage]);

      // Simulate AI typing
      setTimeout(() => {
        // Add AI response
        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: [{ text: generateMockResponse() }],
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1500); // Simulate AI thinking time
      //TODO remove the message sending logic to here
    }
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.length === 0 ? (
          <EmptyChat />
        ) : (
          <>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role == "assistant"
                    ? styles.botMessage
                    : styles.userMessage,
                ]}
              >
                <Text
                  style={
                    message.role == "assistant"
                      ? styles.botText
                      : styles.messageText
                  }
                >
                  {message.content[0].text}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            multiline
          />
        </View>
        <Pressable onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: "#666",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  botMessage: {
    backgroundColor: "#E8E8E8",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  botText: {
    fontSize: 16,
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    marginRight: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 8,
    overflow: "hidden",
  },
  selectedImageContainer: {
    width: 100,
    height: 100,
    position: "relative",
    marginTop: 8,
  },
  selectedImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  attachButton: {
    padding: 8,
    position: "absolute",
    right: 0,
  },
  sendButton: {
    padding: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
