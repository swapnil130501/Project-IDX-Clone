# Project IDX Clone

A VSCode-inspired Integrated Development Environment (IDE) clone, designed with a focus on usability and seamless workflow. This project integrates a code editor, terminal, and browser-like functionality in a single interface, providing an immersive development experience.

## Features

- **Code Editor**: Fully functional editor with a dedicated file/folder structure for project management.
- **Terminal**: Integrated terminal powered by [xterm.js](https://xtermjs.org/) for real-time command execution.
- **WebSocket Communication**: Real-time interaction using [Socket.IO](https://socket.io/).
- **Containerization**: Dockerized setup for consistent development and deployment environments.
- **Resizable Panels**: Multi-panel layout inspired by VSCode, implemented with the [Allotment library](https://github.com/johnwalley/allotment).
- **Modern Design**: Styled using [Tailwind CSS](https://tailwindcss.com/) for a responsive and clean interface.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Terminal Integration**: xterm.js
- **Real-Time Communication**: Socket.IO, WebSocket
- **Containerization**: Docker
- **UI Layout**: Allotment library

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/swapnil130501/Project-IDX-Clone.git
   cd Project-IDX-Clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`.

5. To run the application in a Docker container:
   ```bash
   docker-compose up --build
   ```

## Usage

- Navigate through the file structure in the sidebar.
- Use the code editor to write and edit files.
- Execute commands in the terminal with real-time feedback.
- Experience a responsive and dynamic IDE-like interface.

## Folder Structure

```
Project-IDX-Clone/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # React components
│   ├── context/     # Context API for state management
│   ├── styles/      # Tailwind CSS styles
│   ├── utils/       # Utility functions
│   └── App.js       # Main application entry point
├── server/          # Node.js and Express backend
├── Dockerfile       # Docker configuration
├── docker-compose.yml
└── package.json     # Project metadata and dependencies
```

## Future Enhancements

- Add support for syntax highlighting in the code editor.
- Implement file upload and download capabilities.
- Enable multi-user collaboration with real-time updates.
- Integrate authentication for secure project access.
