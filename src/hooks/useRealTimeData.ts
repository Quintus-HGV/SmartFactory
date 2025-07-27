import { useState, useEffect, useRef } from 'react';
import { ref, onValue, off, DatabaseReference } from 'firebase/database';
import { db } from '../firebaseConfig';

export interface LiveData {
  decibel: number;
  humidity:  number;
  relayState: number;
  temperature: number;
  timestamp: string;
  vibration_x: number;
  vibration_y: number;
  vibration_z: number;
  vibration_magnitude?: number; // Calculated field
  is_anomaly: number; // 0 or 1
}

export interface RawFirebaseData {
  decibel: string;
  humidity: string;
  relayState: number;
  temperature: string;
  timestamp: string;
  vibration_x: string;
  vibration_y: string;
  vibration_z: string;
  is_anomaly: number;
}

export interface AnomalyStatus {
  status: 'Normal' | 'Alert' | 'Critical';
  severity: 'low' | 'medium' | 'high';
  firebaseAnomaly: boolean;
  criticalIndicators: number;
}

export interface FailurePrediction {
  prediction: 'Normal' | 'Warning' | 'Critical';
  confidence: number;
}


interface UseRealTimeDataReturn {
  liveData: LiveData | null;
  anomalyStatus: AnomalyStatus | null;
  failurePrediction: FailurePrediction | null;
  historicalData: LiveData[];
  loading: boolean;
  error: string | null;
  triggerEmergencyCall: () => Promise<void>;
}

// Utility function to parse sensor values and remove units
const parseValue = (value: string): number => {
  if (typeof value === 'number') return value;
  // Remove units and parse as float
  const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
  return isNaN(numericValue) ? 0 : numericValue;
};

// Transform raw Firebase data to our LiveData format
const transformFirebaseData = (rawData: RawFirebaseData): LiveData => {
  const vibX = parseValue(rawData.vibration_x);
  const vibY = parseValue(rawData.vibration_y);
  const vibZ = parseValue(rawData.vibration_z);
  
  // Calculate vibration magnitude (overall vibration intensity)
  const vibrationMagnitude = Math.sqrt(vibX * vibX + vibY * vibY + vibZ * vibZ);

  return {
    decibel: parseValue(rawData.decibel),
    humidity: parseValue(rawData.humidity),
    relayState: rawData.relayState,
    temperature: parseValue(rawData.temperature),
    timestamp: rawData.timestamp,
    vibration_x: vibX,
    vibration_y: vibY,
    vibration_z: vibZ,
    vibration_magnitude: vibrationMagnitude,
    is_anomaly: rawData.is_anomaly,
  };
};

// Count critical indicators
const countCriticalIndicators = (data: LiveData): number => {
  let criticalCount = 0;
  
  if (data.decibel > 80) criticalCount++;
  if (data.humidity > 66 || data.humidity < 55) criticalCount++;
  if (data.temperature >= 28) criticalCount++;
  if (data.vibration_magnitude && data.vibration_magnitude > 10) criticalCount++;
  
  return criticalCount;
};
// Generate anomaly status based on sensor readings
const generateAnomalyStatus = (data: LiveData): AnomalyStatus => {
  const { decibel, humidity, temperature, vibration_magnitude, is_anomaly } = data;
  
  const criticalIndicators = countCriticalIndicators(data);
  const firebaseAnomaly = is_anomaly === 1;
  
  // Define thresholds for anomaly detection
  const criticalConditions = [
    decibel > 80,           // High noise level
    humidity > 90 || humidity < 20,  // Extreme humidity
    temperature >= 28,       // High temperature
    vibration_magnitude && vibration_magnitude > 10,  // High vibration
  ];

  const warningConditions = [
    decibel > 65,           // Moderate noise
    humidity > 80 || humidity < 30,  // Moderate humidity issues
    temperature >= 26,       // Elevated temperature
    vibration_magnitude && vibration_magnitude > 8,   // Moderate vibration
  ];

  const criticalCount = criticalConditions.filter(Boolean).length;
  const warningCount = warningConditions.filter(Boolean).length;

  // Critical if Firebase anomaly is detected AND 2+ indicators are critical
  if (firebaseAnomaly && criticalIndicators >= 2) {
    return { 
      status: 'Critical', 
      severity: 'high', 
      firebaseAnomaly, 
      criticalIndicators 
    };
  }
  
  if (criticalCount > 0) {
    return { 
      status: 'Alert', 
      severity: 'high', 
      firebaseAnomaly, 
      criticalIndicators 
    };
  }
  if (warningCount > 1) {
    return { 
      status: 'Alert', 
      severity: 'medium', 
      firebaseAnomaly, 
      criticalIndicators 
    };
  }
  if (warningCount > 0) {
    return { 
      status: 'Alert', 
      severity: 'low', 
      firebaseAnomaly, 
      criticalIndicators 
    };
  }
  
  return { 
    status: 'Normal', 
    severity: 'low', 
    firebaseAnomaly, 
    criticalIndicators 
  };
};

// Emergency call function using Flask backend
const makeEmergencyCall = async (message: string, criticalIndicators: number, anomalyStatus: string): Promise<boolean> => {
  try {
    console.log('🚨 INITIATING EMERGENCY CALL 🚨');
    console.log(`Critical Indicators: ${criticalIndicators}/4`);
    console.log(`Anomaly Status: ${anomalyStatus}`);
    
    const response = await fetch('http://localhost:5000/api/emergency-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        critical_indicators: criticalIndicators,
        anomaly_status: anomalyStatus,
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Emergency call initiated successfully:', result);
      return result.success;
    } else {
      console.error('❌ Failed to initiate emergency call');
      return false;
    }
  } catch (error) {
    console.error('❌ Error making emergency call:', error);
    return false;
  }
};

// Generate failure prediction based on anomaly status and trends
const generateFailurePrediction = (
  anomalyStatus: AnomalyStatus,
  historicalData: LiveData[]
): FailurePrediction => {
  if (anomalyStatus.status === 'Alert' && anomalyStatus.severity === 'high') {
    return { prediction: 'Critical', confidence: 0.85 + Math.random() * 0.1 };
  }
  
  if (anomalyStatus.status === 'Alert' && anomalyStatus.severity === 'medium') {
    return { prediction: 'Warning', confidence: 0.65 + Math.random() * 0.15 };
  }

  // Check for trends in historical data
  if (historicalData.length >= 5) {
    const recentData = historicalData.slice(-5);
    const tempTrend = recentData.every((data, index) => 
      index === 0 || data.temperature >= recentData[index - 1].temperature
    );
    const vibrationTrend = recentData.every((data, index) => 
      index === 0 || (data.vibration_magnitude || 0) >= (recentData[index - 1].vibration_magnitude || 0)
    );

    if (tempTrend && vibrationTrend) {
      return { prediction: 'Warning', confidence: 0.6 + Math.random() * 0.2 };
    }
  }
  return { prediction: 'Normal', confidence: 0.9 + Math.random() * 0.1 };
};

export const useRealTimeData = (): UseRealTimeDataReturn => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [anomalyStatus, setAnomalyStatus] = useState<AnomalyStatus | null>(null);
  const [failurePrediction, setFailurePrediction] = useState<FailurePrediction | null>(null);
  const [historicalData, setHistoricalData] = useState<LiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataRef = useRef<DatabaseReference | null>(null);
  const criticalReadingsRef = useRef<AnomalyStatus[]>([]);

  // Function to trigger emergency call manually
  const triggerEmergencyCall = async (): Promise<void> => {
    const currentAnomalyStatus = anomalyStatus?.status || 'Unknown';
    const criticalCount = anomalyStatus?.criticalIndicators || 0;
    
    const message = `CRITICAL ALERT: Smart Factory Dashboard detected critical anomalies with ${criticalCount} critical indicators. Please check the system immediately.`;
    
    const success = await makeEmergencyCall(message, criticalCount, currentAnomalyStatus);
    
    if (success) {
      console.log('✅ Emergency call triggered successfully');
    } else {
      console.error('❌ Failed to trigger emergency call');
    }
  };

  useEffect(() => {
    // Create reference to the sensor data in Firebase
    // Adjust the path based on your Firebase database structure
    dataRef.current = ref(db, 'FactoryData'); // Updated to match your Firebase structure

    const handleDataChange = (snapshot: any) => {
      try {
        const rawDataObj = snapshot.val();

        if (!rawDataObj) {
          setError('No data available from Firebase');
          setLoading(false);
          return;
        }

        // Check if rawDataObj is a single object or contains multiple entries
        let latestRawData: RawFirebaseData;
        
        if (rawDataObj.decibel !== undefined) {
          // Direct object structure
          latestRawData = rawDataObj as RawFirebaseData;
        } else {
          // Multiple entries - get the latest one
          const entries = Object.entries(rawDataObj);
          if (entries.length === 0) {
            setError('No data available from Firebase');
            setLoading(false);
            return;
          }

          // Sort by timestamp if available, otherwise by key (push ID)
          const sorted = entries.sort((a, b) => {
            const aData = a[1] as RawFirebaseData;
            const bData = b[1] as RawFirebaseData;
            const aTime = new Date(aData.timestamp).getTime();
            const bTime = new Date(bData.timestamp).getTime();
            return bTime - aTime;
          });

          latestRawData = sorted[0][1] as RawFirebaseData;
        }

        const transformedData = transformFirebaseData(latestRawData);

        setLiveData(transformedData);

        // Generate anomaly status and failure prediction
        const anomaly = generateAnomalyStatus(transformedData);
        setAnomalyStatus(anomaly);

        // Track critical readings for analysis
        criticalReadingsRef.current.push(anomaly);
        
        // Keep only last 5 readings for consecutive check
        if (criticalReadingsRef.current.length > 5) {
          criticalReadingsRef.current = criticalReadingsRef.current.slice(-5);
        }
        
        // Check for emergency call conditions
        const recentCritical = criticalReadingsRef.current.slice(-4); // Last 4 readings
        const consecutiveCritical = recentCritical.every(reading => 
          reading.status === 'Critical' && 
          reading.firebaseAnomaly && 
          reading.criticalIndicators >= 2
        );
        
        // Auto-trigger emergency call if conditions are met
        if (consecutiveCritical && recentCritical.length >= 2) {
          console.log('🚨 AUTO-TRIGGERING EMERGENCY CALL 🚨');
          console.log(`Consecutive critical readings: ${recentCritical.length}`);
          console.log(`Critical indicators: ${anomaly.criticalIndicators}/4`);
          console.log(`Firebase anomaly: ${anomaly.firebaseAnomaly}`);
          
          // Auto-trigger emergency call via Flask backend
          const autoMessage = `AUTOMATIC EMERGENCY ALERT: ${recentCritical.length} consecutive critical readings detected with ${anomaly.criticalIndicators} critical indicators and confirmed anomaly detection.`;
          
          makeEmergencyCall(autoMessage, anomaly.criticalIndicators, anomaly.status).then(success => {
            if (success) {
              console.log('✅ Auto-emergency call triggered successfully');
            } else {
              console.error('❌ Failed to trigger auto-emergency call');
            }
          });
        }
        
        // Add to historical data (keep last 30 minutes worth)
        setHistoricalData(prev => {
          const updated = [...prev, transformedData];
          const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
          
          // Filter by timestamp if available, otherwise keep last 360 entries (30 min * 12 entries/min)
          return updated.filter((item, index) => {
            if (item.timestamp) {
              try {
                const itemTime = new Date(item.timestamp);
                return itemTime >= thirtyMinutesAgo;
              } catch {
                // If timestamp parsing fails, keep recent entries by index
                return index >= updated.length - 360;
              }
            }
            return index >= updated.length - 360;
          });
        });

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error processing Firebase data:', err);
        setError('Error processing sensor data');
        setLoading(false);
      }
    };

    const handleError = (error: any) => {
      console.error('Firebase connection error:', error);
      setError('Failed to connect to Firebase database');
      setLoading(false);
    };

    // Set up the real-time listener
    if (dataRef.current) {
      onValue(dataRef.current, handleDataChange, handleError);
    }

    // Cleanup function
    return () => {
      if (dataRef.current) {
        off(dataRef.current, 'value', handleDataChange);
      }
    };
  }, []);

  // Update failure prediction when anomaly status or historical data changes
  useEffect(() => {
    if (anomalyStatus) {
      const prediction = generateFailurePrediction(anomalyStatus, historicalData);
      setFailurePrediction(prediction);
    }
  }, [anomalyStatus, historicalData]);

  return {
    liveData,
    anomalyStatus,
    failurePrediction,
    historicalData,
    loading,
    error,
    triggerEmergencyCall,
  };
};