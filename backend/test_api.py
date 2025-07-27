#!/usr/bin/env python3
"""
Test script for Flask backend API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_get_thresholds():
    """Test getting thresholds"""
    print("Testing get thresholds...")
    response = requests.get(f"{BASE_URL}/api/thresholds")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_analyze_sensor_data():
    """Test sensor data analysis"""
    print("Testing sensor data analysis...")
    
    # Test normal data
    normal_data = {
        "decibel": 45,
        "humidity": 60,
        "temperature": 25,
        "vibration_magnitude": 5,
        "is_anomaly": 0
    }
    
    response = requests.post(f"{BASE_URL}/api/analyze-sensor-data", json=normal_data)
    print(f"Normal data - Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()
    
    # Test critical data
    critical_data = {
        "decibel": 85,
        "humidity": 15,
        "temperature": 38,
        "vibration_magnitude": 15,
        "is_anomaly": 1
    }
    
    response = requests.post(f"{BASE_URL}/api/analyze-sensor-data", json=critical_data)
    print(f"Critical data - Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_emergency_call():
    """Test emergency call endpoint"""
    print("Testing emergency call...")
    
    call_data = {
        "message": "Test emergency call from API",
        "critical_indicators": 3,
        "anomaly_status": "Critical"
    }
    
    response = requests.post(f"{BASE_URL}/api/emergency-call", json=call_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_update_thresholds():
    """Test updating thresholds"""
    print("Testing threshold update...")
    
    new_thresholds = {
        "temperature": {
            "warning": {"min": 28, "max": 32},
            "critical": {"min": 32, "max": 45}
        }
    }
    
    response = requests.put(f"{BASE_URL}/api/thresholds", json=new_thresholds)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

if __name__ == "__main__":
    print("Flask Backend API Test Suite")
    print("=" * 40)
    
    try:
        test_health_check()
        test_get_thresholds()
        test_analyze_sensor_data()
        test_emergency_call()
        test_update_thresholds()
        
        print("All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to Flask backend")
        print("Make sure the Flask server is running on http://localhost:5000")
        print("Run: python app.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}") 