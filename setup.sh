#!/bin/bash

# Service Booking Platform - Setup Script

echo "🚀 Setting up Service Booking Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found$(node --version)${NC}"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB is not installed locally. Using MongoDB Atlas? Proceed anyway.${NC}"
fi

# Setup Backend
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend
npm install

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-booking
JWT_SECRET=dev_secret_key_change_in_production
OTP_EXPIRY=300
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EOF
    echo -e "${GREEN}✓ Backend .env created${NC}"
    echo -e "${YELLOW}⚠ Update SMTP credentials in backend/.env${NC}"
else
    echo -e "${GREEN}✓ Backend .env already exists${NC}"
fi

cd ..

# Setup Frontend
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd frontend
npm install

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}✓ Frontend .env created${NC}"
else
    echo -e "${GREEN}✓ Frontend .env already exists${NC}"
fi

cd ..

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update SMTP credentials in backend/.env"
echo "2. Ensure MongoDB is running"
echo "3. Run: cd backend && npm run dev"
echo "4. In another terminal: cd frontend && npm start"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
