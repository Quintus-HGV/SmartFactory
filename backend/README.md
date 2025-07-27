# Smart Factory Flask Backend

This Flask backend handles Twilio emergency calls and sensor data analysis for the Smart Factory Dashboard.

## Features

- **Emergency Call System**: Automated Twilio calls and SMS alerts
- **Sensor Data Analysis**: Real-time analysis of sensor data with configurable thresholds
- **Range-based Thresholds**: All thresholds are now in range format (min/max)
- **RESTful API**: Clean API endpoints for frontend integration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables (optional):
```bash
export TWILIO_ACCOUNT_SID=your_account_sid
export TWILIO_AUTH_TOKEN=your_auth_token
export TWILIO_FROM_NUMBER=your_twilio_number
export EMERGENCY_PHONE_NUMBER=your_emergency_number
```

3. Run the server:
```bash
python app.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Emergency Calls
- `POST /api/emergency-call` - Manually trigger emergency call
- `POST /api/analyze-sensor-data` - Analyze sensor data and auto-trigger alerts

### Thresholds
- `GET /api/thresholds` - Get current thresholds
- `PUT /api/thresholds` - Update thresholds

## Threshold Configuration

All thresholds are now in range format:

```json
{
  "decibel": {
    "warning": {"min": 65, "max": 80},
    "critical": {"min": 80, "max": 120}
  },
  "humidity": {
    "warning": {"min": 30, "max": 80},
    "critical": {"min": 20, "max": 90}
  },
  "temperature": {
    "warning": {"min": 30, "max": 35},
    "critical": {"min": 35, "max": 50}
  },
  "vibration_magnitude": {
    "warning": {"min": 8, "max": 12},
    "critical": {"min": 12, "max": 20}
  }
}
```

## Emergency Call Logic

Emergency calls are triggered when:
1. Firebase anomaly is detected (`is_anomaly = 1`)
2. 3 or more critical indicators are present
3. At least 5 minutes have passed since the last call (to prevent spam)

## Usage Examples

### Analyze Sensor Data
```bash
curl -X POST http://localhost:5000/api/analyze-sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "decibel": 85,
    "humidity": 25,
    "temperature": 38,
    "vibration_magnitude": 15,
    "is_anomaly": 1
  }'
```

### Trigger Manual Emergency Call
```bash
curl -X POST http://localhost:5000/api/emergency-call \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Manual emergency call",
    "critical_indicators": 3,
    "anomaly_status": "Critical"
  }'
```

### Update Thresholds
```bash
curl -X PUT http://localhost:5000/api/thresholds \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": {
      "warning": {"min": 28, "max": 32},
      "critical": {"min": 32, "max": 45}
    }
  }'
``` 