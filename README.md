# 🗡️ TaskQuest

**TaskQuest** is a basic task manager — with a twist.

Instead of just managing your to-dos, **TaskQuest** turns your day into a game-like experience. Once you've created three or more tasks, a **Phaser-based quest** begins. A pixel character embarks on a journey, and their health is tied directly to your real-world task completion.

If you miss tasks, your character loses health. Complete them, and your quest continues strong. It’s productivity, gamified.

---

## 🚀 Tech Stack

- **React** – UI framework
- **Phaser** – Game engine for the quest scenes
- **Electron** – To run the app as a desktop application
- **Python (Flask)** – Backend server handling authentication, tasks, etc.

---

## 🎮 Features

- 🔐 User authentication (login/signup)
- ✅ Task creation, editing, and deletion
- 📅 Task scheduling by date and time
- 🧠 Tasks auto-update their status (e.g. incomplete if not finished on time)
- 🧙‍♂️ Phaser quest begins after 3+ tasks are scheduled
- ❤️ Character loses health when you miss tasks
- 🪦 Quest ends when too many tasks are missed (with death animation)
- 🧘 Responsive and visually clean UI

---

## 🛠️ Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/ianjuly4/taskquest
npm install
cd taskquest
    cd client
        npm run dev 
    cd server
        python app.py 