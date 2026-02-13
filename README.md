# Secure Test Environment Enforcement (STEE) System

## 🛡️ Overview
The **Secure Test Environment Enforcement (STEE)** system is a high-security, React-based application designed to simulate a proctored exam environment. It acts as a "digital exam jail," monitoring user actions, blocking unauthorized interactions, and ensuring the integrity of online assessments.

## 🚀 Features

### 🔒 Core Security
- **Fullscreen Enforcement**: Users must stay in fullscreen mode to view exam content.
- **Tab Switching Detection**: instantly detects and logs if the user switches tabs or minimizes the browser.
- **Focus Monitoring**: Tracks window focus loss (e.g., clicking on a dual monitor or system notification).
- **Input Blocking**: Disables Right-Click, Copy, Paste, Cut, and Drag-and-Drop to prevent cheating.

### 📊 Monitoring & Logging
- **Violation Tracking**: Counts "Strikes" for every security breach.
- **Automated Actions**:
    - **Warning Modal**: Appears immediately upon violation.
    - **Auto-Lock**: Locks the exam after **7 violations** (configurable).
- **Resilient Logging**:
    - Logs are buffered in memory and batched to a mock API.
    - **Offline Support**: Logs are saved to `localStorage` if the network fails or the browser crashes, and are restored upon re-entry.

### ⏱️ Session Management
- **Live Exam Timer**: Precise countdown that persists across page refreshes.
- **State Recovery**: If the user accidentally closes the browser, their timer and violation count are restored (session persistence).

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API + `useReducer`
- **Performance**: `useRef` event queues to minimize re-renders during high-frequency monitoring.

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhanashreethube/stee-system.git
   cd stee-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🧪 How to Test Security Features

1. **Start the Exam**: Click the "Start Exam Session" button. You will be forced into fullscreen.
2. **Tab Switch**: Try pressing `Alt+Tab` or clicking another tab. You will see a warning modal and the violation count increase.
3. **Esc Key**: Press `Esc` to exit fullscreen. The exam content will be hidden by a "Fullscreen Required" blocker.
4. **Right Click**: Try to right-click anywhere on the page. It will be blocked.
5. **Refresh**: Refresh the page. Notice that the timer continues from where it left off, and your violation count is preserved.

## 📂 Project Structure

```
src/
 ├── features/exam-security/
 │   ├── hooks/              # Custom security hooks
 │   │   ├── useSecurityMonitor.ts   # Watchdog for visibility/focus
 │   │   ├── useLogService.ts        # Buffering & offline logging
 │   │   ├── useDefensiveBlockers.ts # Input blocking (copy/paste)
 │   │   └── ...
 │   ├── context/            # Global security state (Reducer)
 │   ├── components/         # UI Components (Modals, Badges)
 │   └── pages/              # Main SecureTestPage Container
 └── App.tsx                 # Entry point
```

## 📝 License
This project is for educational and assessment purposes.
