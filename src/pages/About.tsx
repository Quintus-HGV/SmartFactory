import React from 'react';
import { Factory, Cpu, Shield, BarChart3, Zap, Users, Award, Globe, Database } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-Time Monitoring',
      description: 'Continuous monitoring of sound, humidity, temperature, and vibration with Firebase integration.',
    },
    {
      icon: Shield,
      title: 'Predictive Analytics',
      description: 'Advanced algorithms predict equipment failures based on multi-sensor data analysis.',
    },
    {
      icon: Zap,
      title: 'Anomaly Detection',
      description: 'Intelligent detection of unusual patterns across all sensor parameters with severity levels.',
    },
    {
      icon: Database,
      title: 'Firebase Integration',
      description: 'Real-time data synchronization with Firebase Realtime Database for instant updates.',
    },
  ];

  const sensors = [
    { name: 'Sound Level Sensor', unit: 'dB', description: 'Monitors ambient noise levels' },
    { name: 'Humidity Sensor', unit: '%', description: 'Tracks environmental humidity' },
    { name: 'Temperature Sensor', unit: '°C', description: 'Measures ambient temperature' },
    { name: '3-Axis Accelerometer', unit: 'm/s²', description: 'Detects vibrations in X, Y, Z axes' },
    { name: 'Relay Control', unit: 'Digital', description: 'Controls equipment on/off state' },
  ];

  const technologies = [
    'React & TypeScript',
    'Firebase Realtime Database',
    'Chart.js for Data Visualization',
    'Real-time WebSocket Communication',
    'Machine Learning Algorithms',
    'Responsive Web Design',
    'Tailwind CSS',
    'Lucide React Icons',
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Factory className="h-16 w-16 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Smart Factory Dashboard</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A comprehensive Industry 4.0 solution for real-time monitoring, predictive maintenance, 
          and intelligent factory automation. Now powered by Firebase Realtime Database for instant data synchronization.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <feature.icon className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Sensor Configuration */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <Cpu className="h-8 w-8 text-green-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Sensor Configuration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">{sensor.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Unit:</span>
                <span className="text-blue-400 font-mono">{sensor.unit}</span>
              </div>
              <p className="text-gray-400 text-sm">{sensor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <Globe className="h-8 w-8 text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Project Overview</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">What it Does</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Monitors sound levels, humidity, temperature, and 3-axis vibration in real-time
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Provides early warning system for equipment failures with confidence levels
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Visualizes historical trends and patterns across all sensor parameters
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Controls relay states and exports comprehensive data for analysis
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Technologies Used</h3>
            <div className="grid grid-cols-2 gap-2">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-gray-700 px-3 py-2 rounded text-sm text-gray-300">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Firebase Integration */}
      <div className="bg-gradient-to-r from-orange-900 to-red-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <Database className="h-8 w-8 text-orange-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Firebase Integration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Real-time Features</h3>
            <ul className="space-y-2 text-orange-100">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Instant data synchronization across all connected devices
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Automatic reconnection and offline support
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Scalable cloud infrastructure with global CDN
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Data Structure</h3>
            <div className="bg-gray-900 p-4 rounded text-sm font-mono text-gray-300">
              <div>sensorData: {`{`}</div>
              <div className="ml-4">decibel: "49.44 dB"</div>
              <div className="ml-4">humidity: "73.45 %"</div>
              <div className="ml-4">temperature: "26.03 °C"</div>
              <div className="ml-4">vibration_x: "-0.65 m/s²"</div>
              <div className="ml-4">vibration_y: "3.51 m/s²"</div>
              <div className="ml-4">vibration_z: "-10.40 m/s²"</div>
              <div className="ml-4">relayState: 1</div>
              <div className="ml-4">timestamp: "2025-07-07 20:27:37"</div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <Award className="h-8 w-8 text-yellow-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Business Benefits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">↓50%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Reduced Downtime</h3>
            <p className="text-blue-200">Multi-sensor predictive maintenance reduces unexpected equipment failures</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">↑40%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Increased Efficiency</h3>
            <p className="text-blue-200">Real-time environmental monitoring optimizes production conditions</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">↓35%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lower Costs</h3>
            <p className="text-blue-200">Comprehensive monitoring reduces maintenance and energy costs</p>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <Cpu className="h-8 w-8 text-green-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Technical Specifications</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">System Requirements</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Update Method:</span>
                <span className="text-white">Real-time Firebase sync</span>
              </div>
              <div className="flex justify-between">
                <span>Data Retention:</span>
                <span className="text-white">30 minutes rolling</span>
              </div>
              <div className="flex justify-between">
                <span>Sensor Count:</span>
                <span className="text-white">5 sensor types</span>
              </div>
              <div className="flex justify-between">
                <span>Alert Levels:</span>
                <span className="text-white">Normal, Warning, Critical</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Monitoring Thresholds</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-700 p-2 rounded">
                <span className="text-yellow-400">Sound:</span> <span className="text-gray-300">Normal &lt;65dB, Warning &lt;80dB, Critical &gt;80dB</span>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <span className="text-cyan-400">Humidity:</span> <span className="text-gray-300">Normal 30-80%, Warning 20-90%, Critical &lt;20% or &gt;90%</span>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <span className="text-orange-400">Temperature:</span> <span className="text-gray-300">Normal &lt;30°C, Warning &lt;35°C, Critical &gt;35°C</span>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <span className="text-red-400">Vibration:</span> <span className="text-gray-300">Normal &lt;8m/s², Warning &lt;12m/s², Critical &gt;12m/s²</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team/Credits */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <Users className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Project Credits</h2>
        <p className="text-gray-400 mb-6">
          This Smart Factory Dashboard was developed as part of an Industry 4.0 initiative to modernize 
          manufacturing processes through intelligent monitoring, predictive analytics, and real-time data synchronization.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full text-sm">
            Industrial IoT
          </span>
          <span className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full text-sm">
            Firebase Integration
          </span>
          <span className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full text-sm">
            Real-time Analytics
          </span>
          <span className="bg-purple-900 text-purple-200 px-4 py-2 rounded-full text-sm">
            Multi-sensor Monitoring
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;