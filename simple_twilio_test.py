#!/usr/bin/env python3
"""
Simple Twilio Call Test
Just tests if Twilio can make a call to your phone number.
"""

from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
import time

# Your Twilio credentials (update these with your actual credentials)
TWILIO_ACCOUNT_SID = 'ACd66e3fbeb016bb462d434b21d34744d8'
TWILIO_AUTH_TOKEN = '8aa0a628add8a3fe7e0117b6477659ae'
TWILIO_FROM_NUMBER = '+18583305539'
YOUR_PHONE_NUMBER = '+918792190437'  # Your phone number to receive the call

def make_simple_call():
    """Make a simple test call"""
    try:
        print("📞 Testing Twilio Call...")
        print(f"From: {TWILIO_FROM_NUMBER}")
        print(f"To: {YOUR_PHONE_NUMBER}")
        print("=" * 40)
        
        # Initialize Twilio client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Make the call
        call = client.calls.create(
            to=YOUR_PHONE_NUMBER,
            from_=TWILIO_FROM_NUMBER,
            twiml='<Response><Say>Hello! This is a test call from your Smart Factory system. The call functionality is working correctly.</Say></Response>'
        )
        
        print(f"✅ Call initiated successfully!")
        print(f"Call SID: {call.sid}")
        print(f"Status: {call.status}")
        print(f"Direction: {call.direction}")
        
        # Wait a moment and check status
        time.sleep(3)
        
        # Get updated call status
        updated_call = client.calls(call.sid).fetch()
        print(f"Updated Status: {updated_call.status}")
        
        if updated_call.status in ['ringing', 'in-progress', 'completed']:
            print("🎉 SUCCESS: Call is working! You should receive the call.")
        else:
            print(f"⚠️  Call status: {updated_call.status}")
            
    except Exception as e:
        print(f"❌ Error making call: {str(e)}")
        print("Please check your Twilio credentials and phone number.")

if __name__ == "__main__":
    print("🧪 Simple Twilio Test")
    print("=" * 50)
    
    # Test call
    make_simple_call()
    
    print("\n" + "=" * 50)
    print("✅ Test complete! Check your phone for the call.") 