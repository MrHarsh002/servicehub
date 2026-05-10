# Quick Start Guide

## Prerequisites
- Node.js v14+
- MongoDB
- npm or yarn

## Step 1: Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-booking
JWT_SECRET=dev_secret_key_change_in_production
OTP_EXPIRY=300
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

Start backend:
```bash
npm run dev
```

## Step 2: Setup Frontend

In a new terminal:
```bash
cd frontend
npm install
npm start
```

Frontend opens at `http://localhost:3000`

## Default Routes

### Public Routes
- `/` - Home page
- `/customer/signup` - Customer signup
- `/customer/login` - Customer login
- `/vendor/signup` - Vendor signup
- `/vendor/login` - Vendor login

### Customer Protected Routes
- `/customer/dashboard` - Browse services
- `/customer/bookings` - My bookings
- `/service/:id` - Book service

### Vendor Protected Routes
- `/vendor/dashboard` - View pending bookings
- `/vendor/bookings` - My bookings

## Testing the Application

### Test Customer
Email: test@example.com
Phone: +919999999999
Password: password123

### Test Vendor
Email: vendor@example.com
Phone: +918888888888
Password: password123
Category: Plumbing

## Sample Service Creation

Use POST to `http://localhost:5000/api/services`:
```json
{
  "name": "Plumbing Repair",
  "description": "Professional plumbing repair services",
  "category": "Plumbing",
  "basePrice": 500,
  "estimatedDuration": "1-2 hours"
}
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongo

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/service-booking
```

### CORS Issues
- Ensure both backend and frontend are running
- Backend URL: http://localhost:5000
- Frontend URL: http://localhost:3000

## Features Walkthrough

### Customer Flow
1. Sign up with OTP verification
2. Verify the mobile OTP sent by SMS
3. Login with credentials
4. Browse services by category
5. Book a service with details
6. View booking status
7. Rate service after completion

### Vendor Flow
1. Sign up with business details
2. Login with credentials
3. View pending bookings in dashboard
4. Accept a booking
5. Start service (mark as In Progress)
6. Complete service (mark as Delivered)
7. View customer ratings

## API Testing with Curl

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919999999999"}'
```

### Customer Signup
```bash
curl -X POST http://localhost:5000/api/auth/customer/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"test@example.com",
    "phone":"+919999999999",
    "password":"password123",
    "otp":"123456"
  }'
```

### Get All Services
```bash
curl -X GET http://localhost:5000/api/services
```

## Next Steps

1. Integrate payment gateway (Stripe/Razorpay)
2. Add real-time notifications (Socket.io)
3. Deploy on cloud (Heroku, AWS, DigitalOcean)
4. Create admin dashboard
5. Add mobile app (React Native)
6. Implement advanced filters
7. Add wallet system

## File Structure Overview

```
backend/
├── src/
│   ├── controllers/  (Business logic)
│   ├── models/      (Database schemas)
│   ├── routes/      (API endpoints)
│   ├── middleware/  (Auth & validation)
│   ├── utils/       (Helper functions)
│   └── server.js    (Entry point)
├── package.json
└── .env

frontend/
├── src/
│   ├── pages/       (Page components)
│   ├── components/  (Reusable components)
│   ├── context/     (Auth context)
│   ├── api/         (API configuration)
│   ├── App.js       (Main app)
│   └── index.css    (Global styles)
├── public/
├── package.json
└── .env
```

## Important Notes

- OTP is sent via SMS (configure Twilio)
- Passwords are hashed with bcryptjs
- JWT tokens expire in 7 days
- OTP expires in 5 minutes
- Bookings are soft-deleted (status-based)

## Support

For help, refer to README.md or check backend/src for implementation details.
