import React, { useState } from 'react';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import RealTimeChart from '../components/RealTimeChart';
import { useRealTimeData } from '../hooks/useRealTimeData';

const Historical: React.FC = () => {
  const { historicalData, loading, error } = useRealTimeData();
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'temperature' | 'humidity' | 'decibel' | 'vibration'>('all');

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

  const exportData = () => {
    const csvContent = [
      'Timestamp,Temperature (°C),Humidity (%),Sound Level (dB),Vibration X (m/s²),Vibration Y (m/s²),Vibration Z (m/s²),Vibration Magnitude (m/s²),Relay State',
      ...historicalData.map(item => 
        `${item.timestamp},${item.temperature.toFixed(2)},${item.humidity.toFixed(2)},${item.decibel.toFixed(2)},${item.vibration_x.toFixed(2)},${item.vibration_y.toFixed(2)},${item.vibration_z.toFixed(2)},${(item.vibration_magnitude || 0).toFixed(2)},${item.relayState}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory-sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    if (historicalData.length === 0) return null;

    const temperatureData = historicalData.map(d => d.temperature);
    const humidityData = historicalData.map(d => d.humidity);
    const decibelData = historicalData.map(d => d.decibel);
    const vibrationData = historicalData.map(d => d.vibration_magnitude || 0);

    return {
      temperature: {
        avg: temperatureData.reduce((a, b) => a + b) / temperatureData.length,
        max: Math.max(...temperatureData),
        min: Math.min(...temperatureData),
      },
      humidity: {
        avg: humidityData.reduce((a, b) => a + b) / humidityData.length,
        max: Math.max(...humidityData),
        min: Math.min(...humidityData),
      },
      decibel: {
        avg: decibelData.reduce((a, b) => a + b) / decibelData.length,
        max: Math.max(...decibelData),
        min: Math.min(...decibelData),
      },
      vibration: {
        avg: vibrationData.reduce((a, b) => a + b) / vibrationData.length,
        max: Math.max(...vibrationData),
        min: Math.min(...vibrationData),
      },
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Historical Data Analysis</h1>
          <p className="text-gray-400">Comprehensive view of sensor data trends from Firebase</p>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Metrics</option>
            <option value="temperature">Temperature Only</option>
            <option value="humidity">Humidity Only</option>
            <option value="decibel">Sound Level Only</option>
            <option value="vibration">Vibration Only</option>
          </select>
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Temperature</h3>
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-medium">{stats.temperature.avg.toFixed(2)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Maximum:</span>
                <span className="text-white font-medium">{stats.temperature.max.toFixed(2)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Minimum:</span>
                <span className="text-white font-medium">{stats.temperature.min.toFixed(2)} °C</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Humidity</h3>
              <TrendingUp className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-medium">{stats.humidity.avg.toFixed(2)} %</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Maximum:</span>
                <span className="text-white font-medium">{stats.humidity.max.toFixed(2)} %</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Minimum:</span>
                <span className="text-white font-medium">{stats.humidity.min.toFixed(2)} %</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Sound Level</h3>
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-medium">{stats.decibel.avg.toFixed(2)} dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Maximum:</span>
                <span className="text-white font-medium">{stats.decibel.max.toFixed(2)} dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Minimum:</span>
                <span className="text-white font-medium">{stats.decibel.min.toFixed(2)} dB</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Vibration</h3>
              <TrendingUp className="h-6 w-6 text-red-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-medium">{stats.vibration.avg.toFixed(2)} m/s²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Maximum:</span>
                <span className="text-white font-medium">{stats.vibration.max.toFixed(2)} m/s²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Minimum:</span>
                <span className="text-white font-medium">{stats.vibration.min.toFixed(2)} m/s²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Charts */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">
            Data Trends ({historicalData.length} data points)
          </h2>
        </div>

        {(selectedMetric === 'all' || selectedMetric === 'temperature') && (
          <RealTimeChart
            data={historicalData}
            metric="temperature"
            title="Temperature Trends"
            unit="°C"
            color="#F59E0B"
          />
        )}

        {(selectedMetric === 'all' || selectedMetric === 'humidity') && (
          <RealTimeChart
            data={historicalData}
            metric="humidity"
            title="Humidity Trends"
            unit="%"
            color="#06B6D4"
          />
        )}

        {(selectedMetric === 'all' || selectedMetric === 'decibel') && (
          <RealTimeChart
            data={historicalData}
            metric="decibel"
            title="Sound Level Trends"
            unit="dB"
            color="#8B5CF6"
          />
        )}

        {(selectedMetric === 'all' || selectedMetric === 'vibration') && (
          <>
            <RealTimeChart
              data={historicalData}
              metric="vibration_magnitude"
              title="Vibration Magnitude Trends"
              unit="m/s²"
              color="#EF4444"
            />
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
          </>
        )}
      </div>

      {/* Data Summary */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Total Records</p>
            <p className="text-white font-medium">{historicalData.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Data Source</p>
            <p className="text-white font-medium">Firebase Realtime DB</p>
          </div>
          <div>
            <p className="text-gray-400">Sensor Types</p>
            <p className="text-white font-medium">7 Parameters</p>
          </div>
          <div>
            <p className="text-gray-400">Data Quality</p>
            <p className="text-green-400 font-medium">Real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historical;