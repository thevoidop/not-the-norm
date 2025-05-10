# not-the-norm

An **anonymous opinion-sharing web platform** built with Next.js, MongoDB, and Tailwind CSS.
Users can post bold thoughts without revealing their identity, react with emoji-based feedback, and explore ideas outside the mainstream.

## [Live Demo](https://not-the-norm.onrender.com)

## 🚀 Features

-   🔐 JWT-based authentication with cookie sessions
-   🗣️ Create and share long-form, opinion-based posts
-   💬 React with emoji types: like, laugh, angry, dislike
-   📅 Timestamps with human-readable formats
-   📵 Protected routes for authenticated users only
-   🔔 Toast notifications using React Hot Toast
-   🎨 Clean, responsive design with Tailwind CSS

---

## 🛠️ Tech Stack

-   Next.js 15 (App Router)
-   React
-   MongoDB + Mongoose
-   Tailwind CSS
-   jsonwebtoken (JWT)
-   bcryptjs
-   react-hot-toast

---

## 📁 Folder Structure

/app  
├── page.js — Home feed  
├── profile/page.js — User profile page  
├── api/auth — Auth routes (login, logout, check-auth)  
├── api/posts — Routes for creating posts and reacting

/components  
├── PostCard.jsx — Single post display  
├── PostBox.jsx — New post input UI  
├── Navbar.jsx — Navigation header

/models  
├── User.js — Mongoose user schema  
├── Post.js — Mongoose post schema

/utils  
├── dbConnect.js — MongoDB connection  
├── AuthContext.js — Client-side auth context  
├── middleware.js — Protects routes via Next.js Middleware

---

## 📦 Getting Started

1. Clone the repo:

    ```git
    git clone https://github.com/your-username/not-the-norm.git
    cd not-the-norm
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Create .env.local:

    ```
    MONGODB_URI=your_mongodb_uri
    TOKEN_SECRET=your_jwt_secret
    ```

4. Run the dev server:
    ```
    npm run dev
    ```

---

## 🧾 Environment Variables

-   MONGODB_URI — Your MongoDB connection string
-   TOKEN_SECRET — Secret key for signing JWTs

---

## 🔐 Route Protection

All routes except / are protected.
Middleware checks for a valid JWT cookie and redirects unauthenticated users to /auth/login.

---

## 🖼️ Static Assets

All reaction emoji images (like.svg, laugh.svg, etc.) should be placed in the /public folder.
Access them using /like.svg paths.

---

## 💬 Contributing

Pull requests are welcome.
Please keep discussions thoughtful and aligned with the platform’s goal of respectful discourse around controversial ideas.

---

## 📄 License

MIT License
Use at your own risk. This project is experimental and intended for educational and creative exploration.
