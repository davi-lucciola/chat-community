# 💬 Chat Community

<!-- ![chat_community_logo](.github/assets/chat_community_logo.svg) -->

Chat Community is a modern full stack social platform focused on communities. Users can create communities around shared interests and participate in community-based chats, promoting interaction, collaboration, and knowledge sharing.


## ⚙️ Tech Stack

| Layer      | Tech |
|------------|------|
| Backend    | Node.js, Fastify, TypeScript |
| Frontend   | React, Tanstack Router, TypeScript, TailwindCSS |
| Database   | MongoDB |
| DevOps     | Docker, Docker Compose |
| Lint       | BiomeJS |


## 🚀 Features

- 🔐 JWT-based authentication
- 👤 User profile management
- 🏘️ Community creation and administration
- ➕ Join and leave communities
- 💬 Community-based chat
- 👥 Community members management
- 📱 Responsive and intuitive UI
- 🐳 Dockerized development environment


## 📂 Project Structure

```
chat-community
├── client/                 # React App
│   ├── src/
│   │   ├── app/            # Routing with Tankstack Router
│   │   ├── assets/         # Project assets
│   │   ├── components/     # General components
│   │   ├── lib/            # Internal project library for shared and reusable code
│   │   ├── modules/        # App modules with pages and specific components
│   │   ├── main.tsx        # React entrypoint
│   │   └── router.tsx      # Routing entrypoint
│   └── .env.example
├── server/                 # Fastify App
│   ├── src/
│   │   ├── app/            # App modules separated by domain
│   │   ├── lib/            # Internal project library for shared code and reusable
│   │   ├── plugins/        # Fastify plugins
│   │   ├── utils/          # Short functions of general use
│   │   ├── routes.ts       # Routes entrypoint
│   │   ├── server.ts       # Server entrypoint
│   │   └── settings.ts     # App settings from env
│   └── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🪟 Demonstration

### Landing Page and Auth

### Landing Page and Auth

[landing](https://github.com/user-attachments/assets/b36789ef-0d15-4b11-b508-22b73e946fb6)

### Home Page and Communities

[home](https://github.com/user-attachments/assets/392be45d-7b49-48ff-8346-65f1a3800359)

### Chat between Users

[chat](https://github.com/user-attachments/assets/e112369e-3e5c-4729-a5ea-25150eb7ee32)

## 🚀 Getting Started

### 📦 Requirements

- Node.js 22+
- Docker & Docker Compose
- MongoDB (local or via Docker)


## 🐳 Start with Docker

### Build and run the entire stack

```bash
docker-compose up --build
```

Frontend will be available at: [http://localhost:3000](http://localhost:3000)

Backend API Docs will be available at: [http://localhost:3333/docs](http://localhost:3333/docs)

## 🧪 Tests

🚧 WIP
Automated tests will be introduced in future iterations of the project.


## 📌 Roadmap

- [x] Real-time chat with WebSockets
- [x] Message replies
- [ ] Message Notification
- [ ] Upload Images to Profile and Community
- [ ] Public and private communities
- [ ] User updated event (imageUrl in messages and community membership)
