from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
import logging
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Twilio Configuration
TWILIO_ACCOUNT_SID = 'ACd66e3fbeb016bb462d434b21d34744d8'
TWILIO_AUTH_TOKEN = '8aa0a628add8a3fe7e0117b6477659ae'
TWILIO_FROM_NUMBER = '+18583305539'
YOUR_PHONE_NUMBER = '+918792190437'  # Your phone number to receive the call

# Initialize Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Configurable thresholds (in range format)
THRESHOLDS = {
    'decibel': {
        'warning': {'min': 65, 'max': 80},
        'critical': {'min': 80, 'max': 120}
    },
    'humidity': {
        'warning': {'min': 30, 'max': 80},
        'critical': {'min': 20, 'max': 90}
    },
    'temperature': {
        'warning': {'min': 26, 'max': 100},
        'critical': {'min': 28, 'max': 100}
    },
    'vibration_magnitude': {
        'warning': {'min': 8, 'max': 12},
        'critical': {'min': 12, 'max': 20}
    }
}

# Track emergency call history to prevent spam
emergency_call_history = {}

def is_in_range(value, range_dict):
    """Check if a value is within the specified range"""
    return range_dict['min'] <= value <= range_dict['max']

def count_critical_indicators(sensor_data):
    """Count how many sensors are in critical range"""
    critical_count = 0
    
    if is_in_range(sensor_data.get('decibel', 0), THRESHOLDS['decibel']['critical']):
        critical_count += 1
    
    if is_in_range(sensor_data.get('humidity', 0), THRESHOLDS['humidity']['critical']):
        critical_count += 1
    
    if is_in_range(sensor_data.get('temperature', 0), THRESHOLDS['temperature']['critical']):
        critical_count += 1
    
    if is_in_range(sensor_data.get('vibration_magnitude', 0), THRESHOLDS['vibration_magnitude']['critical']):
        critical_count += 1
    
    return critical_count

def generate_anomaly_status(sensor_data):
    """Generate anomaly status based on sensor readings"""
    critical_indicators = count_critical_indicators(sensor_data)
    firebase_anomaly = sensor_data.get('is_anomaly', 0) == 1
    
    # Check critical conditions
    critical_conditions = [
        is_in_range(sensor_data.get('decibel', 0), THRESHOLDS['decibel']['critical']),
        is_in_range(sensor_data.get('humidity', 0), THRESHOLDS['humidity']['critical']),
        is_in_range(sensor_data.get('temperature', 0), THRESHOLDS['temperature']['critical']),
        is_in_range(sensor_data.get('vibration_magnitude', 0), THRESHOLDS['vibration_magnitude']['critical'])
    ]
    
    # Check warning conditions
    warning_conditions = [
        is_in_range(sensor_data.get('decibel', 0), THRESHOLDS['decibel']['warning']),
        is_in_range(sensor_data.get('humidity', 0), THRESHOLDS['humidity']['warning']),
        is_in_range(sensor_data.get('temperature', 0), THRESHOLDS['temperature']['warning']),
        is_in_range(sensor_data.get('vibration_magnitude', 0), THRESHOLDS['vibration_magnitude']['warning'])
    ]
    
    critical_count = sum(critical_conditions)
    warning_count = sum(warning_conditions)
    
    # Determine status
    if firebase_anomaly and critical_indicators >= 2:
        return {
            'status': 'Critical',
            'severity': 'high',
            'firebase_anomaly': firebase_anomaly,
            'critical_indicators': critical_indicators
        }
    elif critical_count > 0:
        return {
            'status': 'Alert',
            'severity': 'high',
            'firebase_anomaly': firebase_anomaly,
            'critical_indicators': critical_indicators
        }
    elif warning_count > 1:
        return {
            'status': 'Alert',
            'severity': 'medium',
            'firebase_anomaly': firebase_anomaly,
            'critical_indicators': critical_indicators
        }
    elif warning_count > 0:
        return {
            'status': 'Alert',
            'severity': 'low',
            'firebase_anomaly': firebase_anomaly,
            'critical_indicators': critical_indicators
        }
    else:
        return {
            'status': 'Normal',
            'severity': 'low',
            'firebase_anomaly': firebase_anomaly,
            'critical_indicators': critical_indicators
        }

def can_make_emergency_call():
    """Check if enough time has passed since last emergency call"""
    current_time = datetime.now()
    last_call_time = emergency_call_history.get('last_call_time')
    
    if last_call_time is None:
        return True
    
    # Allow emergency calls every 20 seconds
    time_diff = current_time - last_call_time
    return time_diff.total_seconds() > 20  # 20 secocnds

def make_emergency_call(message, critical_indicators, anomaly_status):
    """Make emergency call using Twilio"""
    try:
        if not can_make_emergency_call():
            logger.warning("Emergency call blocked - too soon since last call")
            return False
        
        enhanced_message = f"""CRITICAL FACTORY ALERT! This is an automated emergency call from your Smart Factory Dashboard. 
        We have detected {critical_indicators} out of 4 critical sensor failures with confirmed anomaly detection. 
        {message} 
        Please respond immediately to prevent equipment damage. 
        Check your dashboard at your earliest convenience."""
        
        # Make the call
        call = twilio_client.calls.create(
            to='+918792190437',
            from_='+18583305539',
            twiml=f'<Response><Say voice="alice">{enhanced_message}</Say></Response>'
        )
        """
        # Send SMS as backup
        sms_message = f"🚨 FACTORY ALERT: {critical_indicators}/4 critical sensors failed. Anomaly detected. Check dashboard immediately!"
        twilio_client.messages.create(
            to=EMERGENCY_PHONE_NUMBER,
            from_=TWILIO_FROM_NUMBER,
            body=sms_message
        )"""
        
        # Update call history
        emergency_call_history['last_call_time'] = datetime.now()
        emergency_call_history['call_sid'] = call.sid
        
        logger.info(f"Emergency call initiated successfully: {call.sid}")
        return True
        
    except Exception as e:
        logger.error(f"Error making emergency call: {str(e)}")
        return False

@app.route('/api/emergency-call', methods=['POST'])
def trigger_emergency_call():
    """Manual trigger for emergency call"""
    try:
        data = request.get_json()
        message = data.get('message', 'Manual emergency call triggered')
        critical_indicators = data.get('critical_indicators', 0)
        anomaly_status = data.get('anomaly_status', 'Unknown')
        
        success = make_emergency_call(message, critical_indicators, anomaly_status)
        
        return jsonify({
            'success': success,
            'message': 'Emergency call initiated' if success else 'Failed to initiate emergency call',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in emergency call endpoint: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analyze-sensor-data', methods=['POST'])
def analyze_sensor_data():
    """Analyze sensor data and trigger alerts if needed"""
    try:
        data = request.get_json()
        
        # Transform the data to match our expected format
        sensor_data = {
            'decibel': float(data.get('decibel', 0)),
            'humidity': float(data.get('humidity', 0)),
            'temperature': float(data.get('temperature', 0)),
            'vibration_magnitude': float(data.get('vibration_magnitude', 0)),
            'is_anomaly': int(data.get('is_anomaly', 0))
        }
        
        # Generate anomaly status
        anomaly_status = generate_anomaly_status(sensor_data)
        
        # Check if emergency call should be triggered
        should_trigger_call = (
            anomaly_status['status'] == 'Critical' and
            anomaly_status['firebase_anomaly'] and
            anomaly_status['critical_indicators'] >= 2
        )
        
        response_data = {
            'anomaly_status': anomaly_status,
            'sensor_data': sensor_data,
            'should_trigger_call': should_trigger_call,
            'timestamp': datetime.now().isoformat()
        }
        
        # Auto-trigger emergency call if conditions are met
        if should_trigger_call:
            message = f"CRITICAL ALERT: Smart Factory Dashboard detected critical anomalies with {anomaly_status['critical_indicators']} critical indicators."
            success = make_emergency_call(message, anomaly_status['critical_indicators'], anomaly_status['status'])
            response_data['emergency_call_triggered'] = success
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error analyzing sensor data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/thresholds', methods=['GET'])
def get_thresholds():
    """Get current thresholds"""
    return jsonify(THRESHOLDS)

@app.route('/api/thresholds', methods=['PUT'])
def update_thresholds():
    """Update thresholds"""
    try:
        global THRESHOLDS
        new_thresholds = request.get_json()
        THRESHOLDS.update(new_thresholds)
        
        logger.info("Thresholds updated successfully")
        return jsonify({'success': True, 'thresholds': THRESHOLDS})
        
    except Exception as e:
        logger.error(f"Error updating thresholds: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'twilio_configured': bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 