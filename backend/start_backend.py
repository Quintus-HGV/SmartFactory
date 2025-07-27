#!/usr/bin/env python3
"""
Startup script for Smart Factory Flask Backend
"""

import os
import sys
import subprocess
import time

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import flask_cors
        import twilio
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install dependencies with: pip install -r requirements.txt")
        return False

def start_server():
    """Start the Flask server"""
    print("🚀 Starting Smart Factory Flask Backend...")
    print("=" * 50)
    
    # Check if dependencies are installed
    if not check_dependencies():
        return False
    
    # Set environment variables if not already set
    if not os.getenv('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    try:
        # Start the Flask app
        from app import app
        print("✅ Flask app imported successfully")
        print("🌐 Server will be available at: http://localhost:5000")
        print("📋 API Endpoints:")
        print("   - GET  /api/health")
        print("   - GET  /api/thresholds")
        print("   - PUT  /api/thresholds")
        print("   - POST /api/emergency-call")
        print("   - POST /api/analyze-sensor-data")
        print()
        print("Press Ctrl+C to stop the server")
        print("=" * 50)
        
        # Run the app
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return True
    except Exception as e:
        print(f"❌ Error starting server: {str(e)}")
        return False

if __name__ == "__main__":
    success = start_server()
    sys.exit(0 if success else 1) 