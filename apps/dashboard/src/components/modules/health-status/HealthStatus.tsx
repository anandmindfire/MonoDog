import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { monorepoService } from '../../../services/monorepoService';

interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'error';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface PackageHealth {
  name: string;
  overallScore: number;
  buildStatus: 'success' | 'failed' | 'building' | 'unknown';
  testCoverage: number;
  lintStatus: 'pass' | 'warn' | 'fail';
  securityAudit: 'pass' | 'warn' | 'fail';
  dependencies: 'up-to-date' | 'outdated' | 'vulnerable';
  lastBuild: string;
  lastTest: string;
}

const mockHealthMetrics: HealthMetric[] = [
  { name: 'Build Success Rate', value: 95, unit: '%', status: 'healthy', trend: 'up', lastUpdated: '2 hours ago' },
  { name: 'Test Coverage', value: 87, unit: '%', status: 'warning', trend: 'stable', lastUpdated: '1 hour ago' },
  { name: 'Lint Pass Rate', value: 98, unit: '%', status: 'healthy', trend: 'up', lastUpdated: '30 min ago' },
  { name: 'Security Score', value: 92, unit: '/100', status: 'healthy', trend: 'stable', lastUpdated: '1 hour ago' },
  { name: 'Dependency Health', value: 89, unit: '%', status: 'warning', trend: 'down', lastUpdated: '2 hours ago' },
  { name: 'Performance Score', value: 94, unit: '/100', status: 'healthy', trend: 'up', lastUpdated: '45 min ago' }
];

const mockPackageHealth: PackageHealth[] = [
  {
    name: 'dashboard',
    overallScore: 95,
    buildStatus: 'success',
    testCoverage: 92,
    lintStatus: 'pass',
    securityAudit: 'pass',
    dependencies: 'up-to-date',
    lastBuild: '2 hours ago',
    lastTest: '1 hour ago'
  },
  {
    name: 'backend',
    overallScore: 88,
    buildStatus: 'success',
    testCoverage: 85,
    lintStatus: 'pass',
    securityAudit: 'pass',
    dependencies: 'outdated',
    lastBuild: '3 hours ago',
    lastTest: '2 hours ago'
  },
  {
    name: 'utils',
    overallScore: 78,
    buildStatus: 'success',
    testCoverage: 75,
    lintStatus: 'warn',
    securityAudit: 'pass',
    dependencies: 'vulnerable',
    lastBuild: '1 day ago',
    lastTest: '1 day ago'
  },
  {
    name: 'ci-status',
    overallScore: 92,
    buildStatus: 'success',
    testCoverage: 88,
    lintStatus: 'pass',
    securityAudit: 'pass',
    dependencies: 'up-to-date',
    lastBuild: '4 hours ago',
    lastTest: '3 hours ago'
  },
  {
    name: 'monorepo-scanner',
    overallScore: 65,
    buildStatus: 'failed',
    testCoverage: 60,
    lintStatus: 'fail',
    securityAudit: 'warn',
    dependencies: 'outdated',
    lastBuild: '2 days ago',
    lastTest: '2 days ago'
  }
];

export default function HealthStatus() {
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [healthData, setHealthData] = useState<{
    overallScore: number;
    metrics: any[];
    packageHealth: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const data = await monorepoService.getHealthStatus();
        setHealthData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch health data');
        console.error('Error fetching health data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [refreshKey]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Get status color and icon
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
      case 'pass':
      case 'up-to-date':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'warn':
      case 'outdated':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'failed':
      case 'fail':
      case 'vulnerable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
      case 'pass':
      case 'up-to-date':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'warn':
      case 'outdated':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
      case 'failed':
      case 'fail':
      case 'vulnerable':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowPathIcon className="h-4 w-4 text-green-500 transform rotate-90" />;
      case 'down':
        return <ArrowPathIcon className="h-4 w-4 text-red-500 transform -rotate-90" />;
      default:
        return <ArrowPathIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBuildStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'building':
        return <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Calculate overall health
  if (!healthData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const overallHealth = healthData.overallScore;
  const healthyPackages = healthData.packageHealth.filter(pkg => pkg.score >= 80).length;
  const warningPackages = healthData.packageHealth.filter(pkg => pkg.score >= 60 && pkg.score < 80).length;
  const errorPackages = healthData.packageHealth.filter(pkg => pkg.score < 60).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Status</h1>
          <p className="text-gray-600 mt-1">Monitor the health and performance of your monorepo packages</p>
        </div>
        <button
          onClick={refreshData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Health Score */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Overall Monorepo Health</h2>
            <p className="text-blue-100 mt-1">Based on all package metrics and recent activity</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{overallHealth.toFixed(0)}</div>
            <div className="text-blue-100">out of 100</div>
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-green-300" />
            <span>{healthyPackages} Healthy</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
            <span>{warningPackages} Warnings</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircleIcon className="w-5 h-5 text-red-300" />
            <span>{errorPackages} Errors</span>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthData.metrics.map((metric) => (
          <div key={metric.name} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
              <div className={`w-3 h-3 rounded-full ${
                metric.status === 'healthy' ? 'bg-green-500' : 
                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(metric.status)}`}>
                {metric.status}
              </span>
              <span className="text-sm text-gray-500">{metric.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Package Health Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Package Health Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Build Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Coverage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lint Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {healthData.packageHealth.map((pkg) => (
                <tr key={pkg.package} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <div className="text-sm">📦</div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{pkg.package}</div>
                        <div className="text-sm text-gray-500">Score: {pkg.score}/100</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            pkg.score >= 80 ? 'bg-green-500' :
                            pkg.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${pkg.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{pkg.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        pkg.score >= 80 ? 'bg-green-500' : 
                        pkg.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        pkg.score >= 80 ? 'healthy' : pkg.score >= 60 ? 'warning' : 'error'
                      )}`}>
                        {pkg.score >= 80 ? 'healthy' : pkg.score >= 60 ? 'warning' : 'error'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BeakerIcon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">-</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      pkg.score >= 80 ? 'pass' : pkg.score >= 60 ? 'warn' : 'fail'
                    )}`}>
                      {pkg.score >= 80 ? 'pass' : pkg.score >= 60 ? 'warn' : 'fail'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        pkg.score >= 80 ? 'pass' : pkg.score >= 60 ? 'warn' : 'fail'
                      )}`}>
                        {pkg.score >= 80 ? 'pass' : pkg.score >= 60 ? 'warn' : 'fail'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      pkg.score >= 80 ? 'up-to-date' : pkg.score >= 60 ? 'outdated' : 'vulnerable'
                    )}`}>
                      {pkg.score >= 80 ? 'up-to-date' : pkg.score >= 60 ? 'outdated' : 'vulnerable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Details</button>
                      <button className="text-green-600 hover:text-green-900">Fix</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Health Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Test Coverage Below Target</p>
              <p className="text-sm text-yellow-700">Consider adding more tests to improve coverage above 90%</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <XCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Build Failures Detected</p>
              <p className="text-sm text-red-700">monorepo-scanner package has build failures that need immediate attention</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <ChartBarIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Performance Improvements Available</p>
              <p className="text-sm text-blue-700">Consider optimizing build times and dependency resolution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
