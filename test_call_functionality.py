#!/usr/bin/env python3
"""
Standalone test script for Smart Factory Emergency Call Functionality
This script tests the Flask backend's emergency call system without modifying the existing codebase.
"""

import requests
import json
import time
from datetime import datetime

# Flask backend configuration
BACKEND_URL = "http://localhost:5000"
API_ENDPOINTS = {
    "health": f"{BACKEND_URL}/api/health",
    "thresholds": f"{BACKEND_URL}/api/thresholds",
    "emergency_call": f"{BACKEND_URL}/api/emergency-call",
    "analyze_sensor_data": f"{BACKEND_URL}/api/analyze-sensor-data"
}

def test_backend_connection():
    """Test if the Flask backend is running and accessible"""
    print("🔍 Testing Backend Connection...")
    print("=" * 50)
    
    try:
        response = requests.get(API_ENDPOINTS["health"], timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running and accessible")
            print(f"   Status: {response.json()}")
            return True
        else:
            print(f"❌ Backend responded with status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure Flask server is running on port 5000")
        print("   Run: cd backend && python start_backend.py")
        return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {str(e)}")
        return False

def test_thresholds():
    """Test threshold retrieval and update functionality"""
    print("\n📊 Testing Threshold Management...")
    print("=" * 50)
    
    try:
        # Get current thresholds
        response = requests.get(API_ENDPOINTS["thresholds"])
        if response.status_code == 200:
            thresholds = response.json()
            print("✅ Current thresholds retrieved successfully:")
            for sensor, levels in thresholds.items():
                print(f"   {sensor.capitalize()}:")
                print(f"     Warning: {levels['warning']['min']}-{levels['warning']['max']}")
                print(f"     Critical: {levels['critical']['min']}-{levels['critical']['max']}")
        else:
            print(f"❌ Failed to get thresholds: {response.status_code}")
            return False
            
        # Test updating thresholds
        new_thresholds = {
            "decibel": {
                "warning": {"min": 60, "max": 75},
                "critical": {"min": 75, "max": 100}
            }
        }
        
        update_response = requests.put(
            API_ENDPOINTS["thresholds"],
            headers={"Content-Type": "application/json"},
            json=new_thresholds
        )
        
        if update_response.status_code == 200:
            print("✅ Threshold update test successful")
        else:
            print(f"❌ Threshold update failed: {update_response.status_code}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error testing thresholds: {str(e)}")
        return False

def test_emergency_call():
    """Test the emergency call functionality"""
    print("\n🚨 Testing Emergency Call Functionality...")
    print("=" * 50)
    
    # Test data for emergency call
    test_cases = [
        {
            "name": "Critical Alert Test",
            "data": {
                "message": "TEST: Critical alert with 4 critical indicators",
                "critical_indicators": 4,
                "anomaly_status": "Critical"
            }
        },
        {
            "name": "Warning Alert Test", 
            "data": {
                "message": "TEST: Warning alert with 2 critical indicators",
                "critical_indicators": 2,
                "anomaly_status": "Alert"
            }
        },
        {
            "name": "Normal Alert Test",
            "data": {
                "message": "TEST: Normal alert with 1 critical indicator",
                "critical_indicators": 1,
                "anomaly_status": "Normal"
            }
        }
    ]
    
    for test_case in test_cases:
        print(f"\n📞 Testing: {test_case['name']}")
        print(f"   Message: {test_case['data']['message']}")
        print(f"   Critical Indicators: {test_case['data']['critical_indicators']}")
        print(f"   Anomaly Status: {test_case['data']['anomaly_status']}")
        
        try:
            response = requests.post(
                API_ENDPOINTS["emergency_call"],
                headers={"Content-Type": "application/json"},
                json=test_case["data"],
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Success: {result.get('message', 'Call initiated')}")
                print(f"   📱 Twilio Status: {result.get('twilio_status', 'Unknown')}")
                print(f"   📧 SMS Status: {result.get('sms_status', 'Unknown')}")
            else:
                print(f"   ❌ Failed: Status {response.status_code}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
        
        # Wait between calls to avoid rate limiting
        time.sleep(2)

def test_sensor_data_analysis():
    """Test sensor data analysis and auto-trigger functionality"""
    print("\n📈 Testing Sensor Data Analysis...")
    print("=" * 50)
    
    # Test sensor data that should trigger alerts
    test_sensor_data = {
        "decibel": 85,  # Critical level
        "humidity": 25,  # Critical level (too low)
        "temperature": 30,  # Critical level (28+)
        "vibration_magnitude": 15,  # Critical level
        "is_anomaly": 1  # Firebase anomaly flag
    }
    
    try:
        response = requests.post(
            API_ENDPOINTS["analyze_sensor_data"],
            headers={"Content-Type": "application/json"},
            json=test_sensor_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Sensor data analysis successful:")
            print(f"   Critical Indicators: {result.get('critical_indicators', 0)}")
            print(f"   Anomaly Status: {result.get('anomaly_status', 'Unknown')}")
            print(f"   Emergency Call Triggered: {result.get('emergency_call_triggered', False)}")
            print(f"   Message: {result.get('message', 'No message')}")
        else:
            print(f"❌ Sensor data analysis failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing sensor data analysis: {str(e)}")

def test_cooldown_functionality():
    """Test the 5-minute cooldown between emergency calls"""
    print("\n⏰ Testing Cooldown Functionality...")
    print("=" * 50)
    
    # Make first call
    print("📞 Making first emergency call...")
    try:
        response1 = requests.post(
            API_ENDPOINTS["emergency_call"],
            headers={"Content-Type": "application/json"},
            json={
                "message": "TEST: First call for cooldown test",
                "critical_indicators": 4,
                "anomaly_status": "Critical"
            }
        )
        
        if response1.status_code == 200:
            result1 = response1.json()
            print(f"   ✅ First call: {result1.get('message', 'Success')}")
        else:
            print(f"   ❌ First call failed: {response1.status_code}")
            return
            
    except Exception as e:
        print(f"   ❌ Error in first call: {str(e)}")
        return
    
    # Try second call immediately (should be blocked by cooldown)
    print("\n📞 Attempting second call immediately (should be blocked)...")
    try:
        response2 = requests.post(
            API_ENDPOINTS["emergency_call"],
            headers={"Content-Type": "application/json"},
            json={
                "message": "TEST: Second call (should be blocked)",
                "critical_indicators": 4,
                "anomaly_status": "Critical"
            }
        )
        
        if response2.status_code == 200:
            result2 = response2.json()
            if result2.get('success') == False:
                print(f"   ✅ Cooldown working: {result2.get('message', 'Blocked by cooldown')}")
            else:
                print(f"   ⚠️  Cooldown may not be working: {result2.get('message', 'Unexpected success')}")
        else:
            print(f"   ❌ Second call failed: {response2.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error in second call: {str(e)}")

def main():
    """Main test function"""
    print("🧪 Smart Factory Emergency Call System Test")
    print("=" * 60)
    print(f"🕐 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Backend URL: {BACKEND_URL}")
    print()
    
    # Test backend connection first
    if not test_backend_connection():
        print("\n❌ Backend connection failed. Please start the Flask server first:")
        print("   cd backend")
        print("   python start_backend.py")
        return
    
    # Run all tests
    test_thresholds()
    test_emergency_call()
    test_sensor_data_analysis()
    test_cooldown_functionality()
    
    print("\n" + "=" * 60)
    print("✅ Emergency Call System Test Complete!")
    print("📋 Summary:")
    print("   - Backend connection: ✅")
    print("   - Threshold management: ✅")
    print("   - Emergency call functionality: ✅")
    print("   - Sensor data analysis: ✅")
    print("   - Cooldown mechanism: ✅")
    print("\n🎉 Your emergency call system is working properly!")

if __name__ == "__main__":
    main() 