# ServerView (PM2 version)

# 📝 PM2 Log Viewer

PM2 Log Viewer is a web application built with Node.js and Express for managing and viewing logs of processes managed by PM2.

## ✨ Features

- View a list of online PM2 processes.
- Stream logs (stdout and stderr) of selected processes in real-time.
- Real-time display of CPU and RAM usage for each selected process.
- Choose between different themes (Light Mode, Dark Mode, Retro Mode).
- 🔒 Basic authentication for securing access to the application.

Now, viewing your self-hosted apps and managing logs is easier than ever!

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your/repository.git
   cd repository
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following content:

   ```plaintext
   PM2_HOME=C:\Users\Intel\.pm2
   PORT=3002
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password
   ```

   Adjust the values according to your environment setup.

## 💻 Usage

1. **Start the server with timestamp logging:**

   ```bash
   pm2 start <server-file> --time
   ```

   This command starts the server with timestamp logging enabled, showing when each log entry was generated.

2. **Access the PM2 Log Viewer:**

   Open your web browser and navigate to `http://localhost:3002`.

3. **Authenticate:**

   Use the following credentials to log in:
   - Username: `admin`
   - Password: `password`

4. **Select a process:**

   Choose a process from the dropdown list to view its logs in real-time. You can also select a date range to filter logs.

5. **Select a theme:**

   Change the theme from the dropdown list to switch between Light Mode, Dark Mode, and Retro Mode.

## 📅 Roadmap

- **Enhanced Log Filtering:**
  - Implement date range selection to filter logs by specific time periods.
  - Allow filtering by log levels (info, warning, error).

- **User Management:**
  - Add functionality for managing multiple users with different access levels.
  - Integrate OAuth for easier authentication with third-party services.

- **Performance Improvements:**
  - Optimize log streaming for faster real-time updates.
  - Improve UI responsiveness for better user experience.

## 🔧 Configuration

- Modify CSS files in the `public` directory to customize themes or add new ones.
- Adjust environment variables in the `.env` file for different PM2 configurations or port settings.

## 📜 Additional Recommendations

- **Enable timestamps in logs:**
  - Start the server with `pm2 start <server-file> --time` to include timestamps in log entries.

- **Update server without downtime using PM2:**
  If your server is already running and you want to update it without downtime, use PM2 to reload all running processes with timestamps enabled:
  
  ```bash
  pm2 reload all --time
  ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
