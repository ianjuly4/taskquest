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
bash
git clone https://github.com/ianjuly4/taskquest
cd taskquest

### 2. Install Dependencies
bash
npm install --prefix client
pip install -r server/requirements.txt

### 3. Verify Electron Requirements(Optional)
bash
npm run --prefix client electron:build

### 4. Run Client
bash 
cd client
npm run dev

### 5. Run Server
bash
cd server
python app.py

### 6. Create/Login to profile
Click login button to utilize existing login.
If no current login, click profile to create new login.

### 7. Create atleast 3 Tasks
After logging in click "+" to create a current daily task.
Create at minimum 3 current daily tasks.
Tasks timeslots cannot overlap.
Can only be deleted before starting quest.
Tasks status will auto-"incomplete" if time window is missed.
Task attributes are: 
    Start Date/Time = current date and start time of task.
    Title = brief description of task.
    Duration = duration of task which will create an end time and timer.
    Status = "pending", "complete", and "incomplete." Shows current status of task.
    Color = user specific attribute, helpful with organization. Turns red if "incomplete."
    Content = user's notes or descriptions of tasks. Can be edited after submission. 

### 8. Start Quest
After three tasks have been created, click "Start quest" 
Completion of quest is dependent on the user completing their tasks





