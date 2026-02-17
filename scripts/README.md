# Development Scripts

This directory contains scripts to help with local development of the SHC Library Signin system.

## Available Scripts

### 1. `npm run dev` (Recommended)
Uses the Node.js script for cross-platform compatibility:
```bash
npm run dev
```

### 2. `npm run dev:concurrent`
Uses concurrently package to run both servers:
```bash
npm run dev:concurrent
```

### 3. Bash Script (macOS/Linux)
```bash
./dev-start.sh
npm run dev:bash
```

### 4. Batch Script (Windows)
```batch
dev-start.bat
```

## What These Scripts Do

All development scripts will:

1. **Check Dependencies**: Verify that Node.js and required packages are installed
2. **Install Missing Packages**: Auto-install frontend and backend dependencies if needed
3. **Start Backend API**: Launch the Express server with the admin dashboard
4. **Start Expo Dev Server**: Launch the React Native development server
5. **Monitor Logs**: Display colored output from both servers
6. **Graceful Shutdown**: Stop both servers when you press Ctrl+C

## Development URLs

Once running, you can access:

- **📱 Expo Development**: Follow QR code or terminal instructions
- **💻 Admin Dashboard**: http://localhost:3000/admin
- **🔧 API Documentation**: http://localhost:3000/api
- **❤️ Health Check**: http://localhost:3000/health

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Troubleshooting

### Port Already in Use
If port 3000 is busy, you can change it in `backend/.env`:
```bash
PORT=3001
```

### Dependencies Issues
If you encounter dependency issues, try:
```bash
# Clean install
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install
```

### Expo Issues
If Expo fails to start:
```bash
# Clear Expo cache
npx expo start --clear
```

## Manual Commands

You can also run servers manually:

```bash
# Backend only
cd backend
npm run dev

# Expo only (in separate terminal)
npx expo start
```

## Environment Configuration

The backend uses environment variables from `backend/.env`. Key settings:

- `PORT`: Backend server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `ADMIN_USERNAME`: Admin dashboard username
- `ADMIN_PASSWORD`: Admin dashboard password
- `JWT_SECRET`: Secret key for authentication tokens

## Features

### Auto-Installation
Scripts automatically install missing dependencies for both frontend and backend.

### Colored Output
Different colors for different services:
- 🔵 Blue: Backend API logs
- 🟣 Magenta: Expo development server
- 🟡 Yellow: Warnings and info
- 🔴 Red: Errors
- 🟢 Green: Success messages

### Cross-Platform Support
- **macOS/Linux**: Use bash script or Node.js script
- **Windows**: Use batch script or Node.js script
- **All Platforms**: Node.js script (`npm run dev`) works everywhere

### Graceful Shutdown
Press Ctrl+C to cleanly shut down both servers and exit.

## Development Workflow

1. Run `npm run dev` to start both servers
2. Open admin dashboard in browser to monitor library activity
3. Use Expo Go app or simulator to test the mobile interface
4. Make changes to code - both servers will restart automatically
5. Press Ctrl+C when done to stop everything

## Logs

Development logs are written to:
- `logs/backend-dev.log`: Backend server output
- `logs/expo-dev.log`: Expo development server output
- Console: Live colored output from both servers