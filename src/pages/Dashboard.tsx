import React from 'react';
import { Volume2, Droplets, Thermometer, AlertTriangle, Shield, Cpu, Activity, Power, Phone, PhoneCall } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import RealTimeChart from '../components/RealTimeChart';
import { useRealTimeData } from '../hooks/useRealTimeData';

const Dashboard: React.FC = () => {
  const { liveData, anomalyStatus, failurePrediction, historicalData, twilioAlert, loading, error, triggerTwilioCall } = useRealTimeData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-500 text-red-100 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  if (!liveData || !anomalyStatus || !failurePrediction) {
    return (
      <div className="text-center text-gray-400">
        <div className="bg-yellow-900 border border-yellow-500 text-yellow-100 px-4 py-3 rounded mb-4">
          <p>Waiting for Firebase data...</p>
          <p className="text-sm mt-2">
            Make sure your Firebase path is correct: <code>FactoryData</code>
          </p>
          <p className="text-sm">
            Expected data structure: decibel, humidity, temperature, vibration_x, vibration_y, vibration_z, relayState, is_anomaly, timestamp
          </p>
        </div>
      </div>
    );
  }

  const getStatusLevel = (status: string, prediction: string) => {
    if (status === 'Critical') return 'critical';
    if (prediction === 'Critical' || status === 'Alert') return 'critical';
    if (prediction === 'Warning') return 'warning';
    return 'normal';
  };

  const getDecibelStatus = (decibel: number) => {
    if (decibel > 80) return 'critical';
    if (decibel > 65) return 'warning';
    return 'normal';
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity > 90 || humidity < 20) return 'critical';
    if (humidity > 80 || humidity < 30) return 'warning';
    return 'normal';
  };

  const getTemperatureStatus = (temperature: number) => {
    if (temperature > 35) return 'critical';
    if (temperature > 30) return 'warning';
    return 'normal';
  };

  const getVibrationStatus = (vibration: number) => {
    if (vibration > 12) return 'critical';
    if (vibration > 8) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Real-Time Factory Monitoring</h1>
        <p className="text-gray-400">Live sensor data from Firebase Realtime Database</p>
      </div>

      {/* Twilio Alert Section */}
      {(anomalyStatus.status === 'Critical' || twilioAlert.consecutiveCriticalReadings > 0) && (
        <div className="bg-red-900 border-2 border-red-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-400 mr-3 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-red-100">CRITICAL SYSTEM ALERT</h3>
                <p className="text-red-200">
                  {twilioAlert.consecutiveCriticalReadings > 0 
                    ? `${twilioAlert.consecutiveCriticalReadings} consecutive critical readings detected`
                    : 'Critical anomaly detected with multiple system failures'
                  }
                </p>
                <p className="text-red-300 text-sm mt-1">
                  Firebase Anomaly: {anomalyStatus.firebaseAnomaly ? 'DETECTED' : 'None'} | 
                  Critical Indicators: {anomalyStatus.criticalIndicators}/4
                </p>
                {twilioAlert.triggered && (
                  <p className="text-green-300 text-sm mt-1 font-semibold">
                    ✅ Emergency call initiated to +91 9980683606
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={triggerTwilioCall}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PhoneCall className="h-4 w-4" />
                Call +91 9980683606
              </button>
              {twilioAlert.lastCallTime && (
                <p className="text-red-300 text-xs">
                  Last call: {twilioAlert.lastCallTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          {twilioAlert.message && (
            <div className="mt-4 p-3 bg-red-800 rounded text-red-100 text-sm">
              <strong>Status:</strong> {twilioAlert.message}
            </div>
          )}
        </div>
      )}
      {/* Primary Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Sound Level"
          value={liveData.decibel}
          unit="dB"
          status={getDecibelStatus(liveData.decibel)}
          icon={Volume2}
        />
        <StatusCard
          title="Humidity"
          value={liveData.humidity}
          unit="%"
          status={getHumidityStatus(liveData.humidity)}
          icon={Droplets}
        />
        <StatusCard
          title="Temperature"
          value={liveData.temperature}
          unit="°C"
          status={getTemperatureStatus(liveData.temperature)}
          icon={Thermometer}
        />
        <StatusCard
          title="Vibration Magnitude"
          value={liveData.vibration_magnitude || 0}
          unit="m/s²"
          status={getVibrationStatus(liveData.vibration_magnitude || 0)}
          icon={Activity}
        />
      </div>

      {/* Vibration Components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Vibration X-Axis"
          value={liveData.vibration_x}
          unit="m/s²"
          status={getVibrationStatus(Math.abs(liveData.vibration_x))}
          icon={Activity}
        />
        <StatusCard
          title="Vibration Y-Axis"
          value={liveData.vibration_y}
          unit="m/s²"
          status={getVibrationStatus(Math.abs(liveData.vibration_y))}
          icon={Activity}
        />
        <StatusCard
          title="Vibration Z-Axis"
          value={liveData.vibration_z}
          unit="m/s²"
          status={getVibrationStatus(Math.abs(liveData.vibration_z))}
          icon={Activity}
        />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          title="Relay State"
          value={liveData.relayState ? 'ON' : 'OFF'}
          status={liveData.relayState ? 'normal' : 'warning'}
          icon={Power}
          subtitle={liveData.relayState ? 'Active' : 'Inactive'}
        />
        <StatusCard
          title="Firebase Anomaly"
          value={liveData.is_anomaly ? 'DETECTED' : 'NORMAL'}
          status={liveData.is_anomaly ? 'critical' : 'normal'}
          icon={AlertTriangle}
          subtitle={`Value: ${liveData.is_anomaly}`}
        />
        <StatusCard
          title="Anomaly Detection"
          value={anomalyStatus.status}
          status={anomalyStatus.status === 'Critical' ? 'critical' : getStatusLevel(anomalyStatus.status, '')}
          icon={AlertTriangle}
          subtitle={`Severity: ${anomalyStatus.severity.toUpperCase()} | Critical: ${anomalyStatus.criticalIndicators}/4`}
        />
        <StatusCard
          title="Failure Prediction"
          value={failurePrediction.prediction}
          status={getStatusLevel('', failurePrediction.prediction)}
          icon={failurePrediction.prediction === 'Critical' ? AlertTriangle : Shield}
          subtitle={`Confidence: ${(failurePrediction.confidence * 100).toFixed(1)}%`}
        />
      </div>

      {/* Real-time Charts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Live Sensor Data (Last 30 Minutes)</h2>
        
        {/* Primary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RealTimeChart
            data={historicalData}
            metric="temperature"
            title="Temperature"
            unit="°C"
            color="#F59E0B"
          />
          <RealTimeChart
            data={historicalData}
            metric="humidity"
            title="Humidity"
            unit="%"
            color="#06B6D4"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RealTimeChart
            data={historicalData}
            metric="decibel"
            title="Sound Level"
            unit="dB"
            color="#8B5CF6"
          />
          <RealTimeChart
            data={historicalData}
            metric="vibration_magnitude"
            title="Vibration Magnitude"
            unit="m/s²"
            color="#EF4444"
          />
        </div>

        {/* Vibration Components */}
        <h3 className="text-xl font-bold text-white mt-8">Vibration Components</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RealTimeChart
            data={historicalData}
            metric="vibration_x"
            title="Vibration X-Axis"
            unit="m/s²"
            color="#10B981"
          />
          <RealTimeChart
            data={historicalData}
            metric="vibration_y"
            title="Vibration Y-Axis"
            unit="m/s²"
            color="#F59E0B"
          />
          <RealTimeChart
            data={historicalData}
            metric="vibration_z"
            title="Vibration Z-Axis"
            unit="m/s²"
            color="#EF4444"
          />
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <Cpu className="h-6 w-6 text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">System Status</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Last Update</p>
            <p className="text-white font-medium">
              {liveData.timestamp}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Data Points</p>
            <p className="text-white font-medium">{historicalData.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Firebase Status</p>
            <p className="text-green-400 font-medium">Connected</p>
          </div>
          <div>
            <p className="text-gray-400">Relay State</p>
            <p className={`font-medium ${liveData.relayState ? 'text-green-400' : 'text-yellow-400'}`}>
              {liveData.relayState ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Twilio Status</p>
            <p className={`font-medium ${twilioAlert.triggered ? 'text-red-400' : 'text-green-400'}`}>
              {twilioAlert.triggered ? 'Alert Sent' : 'Standby'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;