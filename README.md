Social Media Mini Platform (MERN Stack)

 Project Overview

The Social Media Mini Platform is a full-stack web application developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js).
It is a simplified version of modern social networking platforms designed to demonstrate core functionalities such as creating posts, liking posts, and commenting.

This project helps in understanding how frontend, backend, and database systems interact to build a dynamic and scalable web application.

---

Features

Create and view posts
Like / Unlike posts
Add and view comments
Real-time UI updates
Responsive design using Tailwind CSS
Fast frontend with Vite + React

---

Tech Stack

  Frontend

 React.js
 Tailwind CSS
 Vite

  Backend

 Node.js
 Express.js

  Database

 MongoDB (NoSQL Database)



Project Structure

```
socialmediamini/
│
├── client/         React Frontend
├── server/         Node + Express Backend
│
├── README.md
└── .gitignore
```



Installation & Setup

Clone the repository

```bash
git clone https://github.com/yourusername/socialmediamini.git
cd socialmediamini
```



Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  SESSION_SECRET=your_secure_session_secret
  CLIENT_URL=http://localhost:8080
```

Run backend:

```bash
npm run dev
```



Setup Frontend

```bash
cd client
npm install
npm run dev
```



API Endpoints

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | /api/posts            | Fetch all posts         |
| POST   | /api/posts            | Create a new post       |
| PUT    | /api/posts/:id        | Edit a post             |
| DELETE | /api/posts/:id        | Delete a post           |
| PUT    | /api/posts/:id/like   | Like/Unlike a post      |
| POST   | /api/comments         | Add comment             |
| GET    | /api/comments/:postId | Get comments for a post |
| PUT    | /api/comments/:id     | Edit a comment          |
| DELETE | /api/comments/:id     | Delete a comment        |
| POST   | /api/auth/register    | Register user           |
| POST   | /api/auth/login       | Login user (session)    |
| POST   | /api/auth/logout      | Logout user             |
| GET    | /api/auth/me          | Get current session     |

---

Learning Outcomes

 Understanding full-stack development using MERN
 REST API design and implementation
 Database modeling using MongoDB
 State management and component-based UI
 Integration between frontend and backend

---

Future Enhancements

 User Authentication (JWT)
 Image Upload (Cloudinary)
 User Profiles
 Notifications
 Deployment (Vercel + Render)

---

Contributors

 Prashant Bhattarai
 Priyansh Tyagi
 Sahil Bansal
 Sparsh Saxena

---

Academic Info

Course: B.Tech CSE (3rd Year)
University: GLA University, Mathura
Supervisor: Mr. Yash Singh

---

License

This project is developed for educational purposes.
