require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const pm2 = require('pm2');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware for basic authentication
const users = {};
users[process.env.ADMIN_USERNAME] = process.env.ADMIN_PASSWORD;

app.use(basicAuth({
    users,
    challenge: true,
    unauthorizedResponse: 'Unauthorized access'
}));


const LOG_FILE_SUFFIXES = ['-out.log', '-error.log']; // Customize suffixes as needed

app.use(express.static('public'));
app.use(express.json());

// Connect to PM2
pm2.connect((err) => {
    if (err) {
        console.error('Error connecting to PM2:', err);
        process.exit(2);
    }

    // API endpoint to fetch list of online processes
    // API endpoint to fetch list of online processes
    app.get('/api/processes', (req, res) => {
        pm2.list((err, processList) => {
            if (err) {
                console.error('Error retrieving PM2 process list:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Filter processes that are online (status is 'online')
            const onlineProcesses = processList.filter((proc) => proc.pm2_env.status === 'online');

            // Return only the process name and pm_id
            const simplifiedProcesses = onlineProcesses.map((proc) => ({ name: proc.name, pm_id: proc.pm_id }));
            res.json(simplifiedProcesses);
        });
    });


    // API endpoint to stream logs for a specific process name
    app.get('/api/logs/:process_name/:log_type', (req, res) => {
        const process_name = req.params.process_name;
        const logType = req.params.log_type; // 'out' or 'error'
        const logFileName = `${process_name}${LOG_FILE_SUFFIXES[logType === 'error' ? 1 : 0]}`; // Construct log file name based on type
        const pm2Home = process.env.PM2_HOME || 'C:/Users/Intel/.pm2'; // Default PM2 home directory
        const logFilePath = path.join(pm2Home, 'logs', logFileName);

        // Check if log file exists
        fs.access(logFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`Log file ${logFileName} for process ${process_name} not found.`);
                return res.status(404).end();
            }

            // Stream log file content to client
            const readStream = fs.createReadStream(logFilePath);
            readStream.pipe(res);

            readStream.on('error', (err) => {
                console.error(`Error streaming logs for process ${process_name} (${logType}):`, err);
                res.status(500).end();
            });

            // Handle termination
            req.on('close', () => {
                readStream.destroy();
            });
        });
    });

    app.get('/api/monit/:process_name', (req, res) => {
       //get cpu and ram usage 
         pm2.describe(req.params.process_name, (err, processDescription) => {
            if (err) {
                console.error('Error retrieving PM2 process description:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            const proc = processDescription[0];
            let memory = proc.monit.memory / (1024 * 1024);
            memory = Math.round(memory * 100) / 100;

            res.json({
                name: proc.name,
                cpu: proc.monit.cpu,
                memory: memory
            });
        }
    );
    }
    );



    // Handle shutdown gracefully
    process.on('SIGINT', () => {
        pm2.disconnect();
        process.exit();
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
