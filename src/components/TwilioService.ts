// Twilio Service for making emergency calls
// Using hardcoded credentials for demo purposes

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export interface CallRequest {
  to: string;
  message: string;
}

export class TwilioService {
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    this.config = config;
  }

  async makeCall(request: CallRequest): Promise<boolean> {
    try {
      console.log('🚨 EMERGENCY CALL INITIATED 🚨');
      console.log(`To: ${request.to}`);
      console.log(`From: ${this.config.fromNumber}`);
      console.log(`Message: ${request.message}`);
      
      // Create TwiML for the call
      const twimlMessage = `<Response><Say voice="alice">${request.message}</Say></Response>`;
      
      // Make the actual Twilio API call
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'To': request.to,
          'From': this.config.fromNumber,
          'Twiml': twimlMessage
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Twilio call initiated successfully:', result.sid);
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Failed to initiate Twilio call:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error making Twilio call:', error);
      return false;
    }
  }

  async sendSMS(request: CallRequest): Promise<boolean> {
    try {
      console.log('📱 SMS ALERT INITIATED 📱');
      console.log(`To: ${request.to}`);
      console.log(`Message: ${request.message}`);
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'To': request.to,
          'From': this.config.fromNumber,
          'Body': request.message
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ SMS sent successfully:', result.sid);
        return true;
      } else {
        const error = await response.text();
        console.error('❌ Failed to send SMS:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending SMS:', error);
      return false;
    }
  }
}

// Your actual Twilio configuration
export const twilioConfig: TwilioConfig = {
  accountSid: '', // Replace with your actual Account SID
  authToken: '', // Replace with your actual Auth Token
  fromNumber: '+19133956396', // Your Twilio phone number
};

// Singleton instance
export const twilioService = new TwilioService(twilioConfig);