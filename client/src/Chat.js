import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create a Socket.IO connection to the server
    const socketInstance = io("http://localhost:8080"); // Make sure this URL matches your server's URL and port

    // Save the Socket.IO instance in state
    setSocket(socketInstance);

    // Listen for chatbot responses from the server
    // socketInstance.on("chatbotResponse", (data) => {
    //   const { message } = data;
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { text: message, isUser: false },
    //   ]);
    // });

    // Listen for received messages from other clients
    socketInstance.on("received query", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${message}`, isUser: false },
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (input.trim() && socket) {
      // Check if the socket is connected
      if (socket.connected) {
        // Add user message to the messages state
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: input, isUser: true },
        ]);
        // Clear the input field
        setInput("");

        // Send the message to the server
        socket.emit("message", input);
      } else {
        console.error("Socket.IO is not connected.");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Header className="bg-primary text-white text-center">
          Chatbot
        </Card.Header>
        <Card.Body style={{ height: "200px", overflowY: "auto" }}>
          <div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`d-flex mb-2 ${
                  message.isUser
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded ${
                    message.isUser ? "bg-primary text-white" : "bg-light"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
        <Card.Footer>
          <Form>
            <Row>
              <Col xs={9}>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </Col>
              <Col xs={3}>
                <Button variant="primary" onClick={handleSend} block>
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Chatbox;
