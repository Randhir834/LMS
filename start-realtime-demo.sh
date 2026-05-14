#!/bin/bash

echo "🚀 Starting Real-time Profile Update Demo"
echo "========================================"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check required ports
echo "📋 Checking required ports..."
check_port 5001 || echo "   Backend API will use port 5001"
check_port 3000 || echo "   Admin website will use port 3000"
check_port 3001 || echo "   Student website will use port 3001"
check_port 3002 || echo "   Instructor website will use port 3002"

echo ""
echo "🔧 Installing dependencies..."

# Install backend dependencies
echo "   Installing backend dependencies..."
cd backend && npm install --silent

# Install admin frontend dependencies
echo "   Installing admin frontend dependencies..."
cd ../frontend/admin && npm install --silent

# Install student website dependencies
echo "   Installing student website dependencies..."
cd ../student-website && npm install --silent

# Install instructor website dependencies
echo "   Installing instructor website dependencies..."
cd ../instructor-website && npm install --silent

cd ../../..

echo ""
echo "🌟 Starting all services..."

# Start backend
echo "   Starting backend API (port 5001)..."
cd backend && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start admin frontend
echo "   Starting admin website (port 3000)..."
cd ../frontend/admin && npm run dev &
ADMIN_PID=$!

# Start student website
echo "   Starting student website (port 3001)..."
cd ../student-website && npm run dev &
STUDENT_PID=$!

# Start instructor website
echo "   Starting instructor website (port 3002)..."
cd ../instructor-website && npm run dev &
INSTRUCTOR_PID=$!

cd ../..

echo ""
echo "✅ All services started successfully!"
echo ""
echo "🌐 Access the applications:"
echo "   📊 Admin Dashboard:     http://localhost:3000"
echo "   🎓 Student Dashboard:   http://localhost:3001"
echo "   👨‍🏫 Instructor Dashboard: http://localhost:3002"
echo "   🔧 Backend API:         http://localhost:5001"
echo ""
echo "🧪 How to test real-time updates:"
echo "   1. Open the Admin Dashboard and navigate to a user profile"
echo "   2. Open the corresponding Student/Instructor Dashboard"
echo "   3. Edit the user profile in the Admin Dashboard"
echo "   4. Watch the changes appear instantly on the Student/Instructor Dashboard!"
echo ""
echo "⏹️  Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $ADMIN_PID $STUDENT_PID $INSTRUCTOR_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait