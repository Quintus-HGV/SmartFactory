# Smart Factory Dashboard

A comprehensive Industry 4.0 solution for real-time monitoring, predictive maintenance, and intelligent factory automation. Now powered by Firebase Realtime Database and Flask backend for emergency alerts.

## 🚀 Features

- **Real-time Sensor Monitoring**: Live data from sound, humidity, temperature, and vibration sensors
- **Firebase Integration**: Instant data synchronization with Firebase Realtime Database
- **Flask Emergency Alerts**: Automated emergency calls via Flask backend when critical conditions persist
- **Predictive Analytics**: Machine learning-based failure prediction with confidence levels
- **Responsive Dashboard**: Modern UI with real-time charts and status indicators
- **Range-based Thresholds**: Configurable sensor thresholds in min/max range format

## 🏗️ Architecture

### Frontend (React + TypeScript)
- Real-time data visualization with Chart.js
- Firebase Realtime Database integration
- Responsive design with Tailwind CSS
- Emergency alert system integration

### Backend (Flask + Python)
- RESTful API for emergency call management
- Twilio integration for voice calls and SMS
- Configurable threshold management
- Sensor data analysis and anomaly detection

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- Firebase project setup

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python start_backend.py
```

## 🔧 Configuration

### Firebase Configuration
Update `src/firebaseConfig.ts` with your Firebase project credentials:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Flask Backend Configuration
Update `backend/app.py` with your Twilio credentials:
```python
TWILIO_ACCOUNT_SID = 'your_account_sid'
TWILIO_AUTH_TOKEN = 'your_auth_token'
TWILIO_FROM_NUMBER = 'your_twilio_number'
EMERGENCY_PHONE_NUMBER = 'your_emergency_number'
```

## 📊 Sensor Thresholds

All thresholds are now in range format (min/max):

| Sensor | Warning Range | Critical Range |
|--------|---------------|----------------|
| Sound Level | 65-80 dB | 80-120 dB |
| Humidity | 30-80% | 20-90% |
| Temperature | 26°C+ | 28°C+ |
| Vibration | 8-12 m/s² | 12-20 m/s² |

## 🚨 Emergency Alert System

### Trigger Conditions
- Firebase anomaly detected (`is_anomaly = 1`)
- 3 or more critical indicators present
- 3-4 consecutive critical readings
- 5-minute cooldown between calls

### API Endpoints
- `POST /api/emergency-call` - Manual emergency call trigger
- `POST /api/analyze-sensor-data` - Analyze sensor data and auto-trigger alerts
- `GET /api/thresholds` - Get current thresholds
- `PUT /api/thresholds` - Update thresholds
- `GET /api/health` - Health check

## 🧪 Testing

### Backend API Testing
```bash
cd backend
python test_api.py
```

### Manual Testing
1. Start both frontend and backend servers
2. Navigate to the dashboard
3. Monitor real-time sensor data
4. Test emergency call functionality

## 📁 Project Structure

```
SmartFactory/
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   └── firebaseConfig.ts # Firebase configuration
├── backend/              # Flask backend
│   ├── app.py           # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   ├── test_api.py      # API testing script
│   └── start_backend.py # Backend startup script
└── README.md            # This file
```

## 🔄 Migration from Twilio Frontend

The project has been migrated from TypeScript Twilio integration to Flask backend:

### Changes Made
- ✅ Removed `src/components/TwilioService.ts`
- ✅ Updated `src/hooks/useRealTimeData.ts` to use Flask API
- ✅ Updated `src/pages/Dashboard.tsx` to remove Twilio UI
- ✅ Updated `src/pages/About.tsx` to reflect Flask backend
- ✅ Created Flask backend with RESTful API
- ✅ Implemented range-based thresholds
- ✅ Added comprehensive testing and documentation

### Benefits
- **Better Security**: API keys stored on backend
- **Improved Scalability**: Centralized emergency call logic
- **Enhanced Flexibility**: Configurable thresholds via API
- **Better Error Handling**: Centralized logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Anjo Joseph
- Dev Mandloi  
- Harsh Gupta
- Pranav Rao
- Subhranil Swar

---

**Note**: Make sure to configure your Firebase and Twilio credentials before running the application. 