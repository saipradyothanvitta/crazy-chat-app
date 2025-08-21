Crazy Chat - Real-Time Chat Application
A full-stack, real-time chat application built with React, Node.js, and Socket.IO. This project allows users to join chat rooms, send messages instantly, and see the status of their messages (sent, delivered, and read).

Live Demo: https://crazy-chat.netlify.app/

Features
Real-Time Messaging: Instantly send and receive messages with no delay.

Chat Rooms: Users can create or join rooms by entering a Room ID.

Typing Indicator: See when another user in the room is typing a message.

Online User Count: The header displays the number of users currently in the chat room.

Join/Leave Notifications: System messages announce when a user joins or leaves the chat.

Message Status:

Sent (✓): Message has been sent from your client.

Delivered (✓✓): Message has been received by the other user(s).

Read (✓✓ in blue): The other user(s) have seen the message.

Responsive Design: The application is fully responsive and works on all devices, including desktops, tablets, and mobile phones.

Tech Stack
This project is built with a modern, full-stack JavaScript architecture.

Category

Technology

Frontend

React.js, Socket.IO Client, HTML5, CSS3

Backend

Node.js, Express.js, Socket.IO (Server), CORS

Deployment

Netlify (Frontend), Render (Backend), Git & GitHub (Version Control)

Local Setup and Installation
To run this project on your local machine, follow these steps:

Prerequisites
Node.js and npm installed on your machine.

1. Clone the Repository
git clone [https://github.com/YourUsername/crazy-chat-app.git](https://github.com/YourUsername/crazy-chat-app.git)
cd crazy-chat-app

2. Set Up the Backend Server
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the server
npm start

The server will be running on http://localhost:3001.

3. Set Up the Frontend Client
Open a new terminal window for this step.

# Navigate to the client directory from the root folder
cd client

# Install dependencies
npm install

# Start the React application
npm start

The application will open automatically in your browser at http://localhost:3000.

Deployment
The application is deployed using a modern, decoupled architecture:

The Node.js backend is hosted as a Web Service on Render.

The React frontend is deployed on Netlify, which is connected to the live backend via environment variables.

The GitHub repository is connected to both services for a seamless Continuous Deployment (CD) pipeline.

Screenshot
<img width="1516" height="763" alt="image" src="https://github.com/user-attachments/assets/b44d9bed-86dc-4537-a2ea-870d320b4a73" />
