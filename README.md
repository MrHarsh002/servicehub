# Service Booking Platform

A full-stack service booking application built with React and Node.js, featuring customer and vendor authentication with mobile OTP verification, similar to MakeMyTrip.

## Features

### Customer Features
✅ OTP-based signup with mobile number verification
✅ Secure login/logout
✅ Browse and filter services by category
✅ Book services with custom date/time and location
✅ View booking history and status
✅ Rate and review completed services
✅ Track vendor details and service progress

### Vendor Features
✅ Vendor signup and login
✅ View pending bookings in their category
✅ Accept or reject bookings
✅ Update booking status (In Progress → Completed)
✅ Mark services as delivered
✅ View customer ratings and reviews
✅ Track accepted bookings and earnings

### Admin Panel
✅ Create and manage services
✅ View all bookings and users

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Twilio** - SMS OTP delivery
- **Bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS** - Styling

## Project Structure

```
Project_CC96/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── serviceController.js
│   │   │   └── bookingController.js
│   │   ├── models/
│   │   │   ├── Customer.js
│   │   │   ├── Vendor.js
│   │   │   ├── Service.js
│   │   │   ├── Booking.js
│   │   │   └── OTP.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── services.js
│   │   │   └── bookings.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── otp.js
│   │   │   └── sms.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── ServiceDetails.js
    │   │   ├── auth/
    │   │   │   ├── CustomerSignup.js
    │   │   │   ├── CustomerLogin.js
    │   │   │   ├── VendorSignup.js
    │   │   │   └── VendorLogin.js
    │   │   ├── customer/
    │   │   │   ├── CustomerDashboard.js
    │   │   │   └── CustomerBookings.js
    │   │   └── vendor/
    │   │       ├── VendorDashboard.js
    │   │       └── VendorBookings.js
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── api/
    │   │   └── axios.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    ├── package.json
    └── .env

```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-booking
JWT_SECRET=your_jwt_secret_key_change_in_production
OTP_EXPIRY=300
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Note:** Use a verified Twilio phone number in E.164 format.

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. In a new terminal, navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/customer/signup` - Customer signup with OTP
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/vendor/signup` - Vendor signup
- `POST /api/auth/vendor/login` - Vendor login

### Services
- `GET /api/services` - Get all services
- `GET /api/services/category/:category` - Get services by category
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (admin)

### Bookings
- `POST /api/bookings` - Create booking (customer)
- `GET /api/bookings/customer/my-bookings` - Get customer bookings
- `GET /api/bookings/vendor/pending` - Get pending bookings (vendor)
- `GET /api/bookings/vendor/my-bookings` - Get vendor bookings
- `PUT /api/bookings/:bookingId/accept` - Accept booking (vendor)
- `PUT /api/bookings/:bookingId/start` - Start booking (vendor)
- `PUT /api/bookings/:bookingId/complete` - Complete booking (vendor)
- `PUT /api/bookings/:bookingId/rate` - Rate booking (customer)

## Usage

### As a Customer
1. Sign up using email, mobile number, and OTP verification
2. Browse available services
3. Book a service by selecting date, time, and location
4. Track booking status
5. Rate the service once completed

### As a Vendor
1. Sign up with business details
2. Log in to view pending bookings
3. Accept bookings matching your service category
4. Update service status (Start → Deliver)
5. View customer ratings and reviews

## Features in Detail

### OTP Verification
- Customers receive 6-digit OTP via SMS on their mobile number
- OTP valid for 5 minutes
- Auto-delete after expiry
- Re-send OTP functionality

### Booking Management
- Real-time status tracking
- Automatic booking ID generation
- Service scheduling with date/time picker
- Location-based services
- Rating system after completion

### Security
- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API endpoints

## Environment Variables

### Backend
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-booking
JWT_SECRET=your_jwt_secret_key_change_in_production
OTP_EXPIRY=300
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Schema

### Customer
```
{
  name, email, phone, password, address, city,
  isOtpVerified, bookings[], createdAt
}
```

### Vendor
```
{
  businessName, ownerName, email, phone, password,
  category, licenseNumber, address, city,
  rating, totalRatings, isVerified, acceptedBookings[], createdAt
}
```

### Service
```
{
  name, description, category, basePrice,
  estimatedDuration, image, createdAt
}
```

### Booking
```
{
  bookingId, customer, service, vendor, status,
  price, scheduledDate, description, address, city,
  customerRating, customerReview, createdAt, updatedAt
}
```

## Future Enhancements

- Payment gateway integration (Stripe/Razorpay)
- Real-time notifications with Socket.io
- Vendor verification and KYC
- Advanced search and filters
- Wallet system
- Dispute resolution system
- Admin dashboard
- Analytics and reporting
- Mobile app (React Native)
- Service categories with sub-categories
- Promotional codes and discounts

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or use Atlas connection string
- Check MONGODB_URI in .env file

### OTP Not Sending to Mobile
- Check Twilio credentials in `.env`
- Make sure `TWILIO_PHONE_NUMBER` is a verified Twilio sender number
- Use phone numbers in E.164 format, for example `+919999999999`
- In development mode, the OTP is logged in the backend console if Twilio is not configured

### CORS Errors
- Frontend and backend should be on different ports
- Backend has CORS enabled for all origins (update as needed)

### Token Errors
- Clear localStorage and login again
- Ensure JWT_SECRET is consistent

## Support

For issues or questions, please create an issue in the repository.

## License

This project is open source and available under the MIT License.

---

**Happy Coding! 🚀**
