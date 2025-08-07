"use client";
import React, { useEffect, useState } from 'react';
import { useUnifiedGoogleMaps } from '@/hooks/useUnifiedGoogleMaps';
import { useGoogleMapsDiagnostics, GoogleMapsStatus } from '@/utils/googleMapsDiagnostics';
import { useModernGooglePlaces } from '@/hooks/useModernGooglePlaces';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'running';
  message: string;
  details?: any;
}

const GoogleMapsTestSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [diagnosticsStatus, setDiagnosticsStatus] = useState<GoogleMapsStatus | null>(null);

  // Hooks
  const { isLoaded, loadError, isPlacesLoaded, apiKey } = useUnifiedGoogleMaps();
  const { getStatus, logDiagnostics, testFunctionality, monitor } = useGoogleMapsDiagnostics();
  const { 
    predictions, 
    isLoading: placesLoading, 
    error: placesError, 
    searchPlaces, 
    getPlaceDetails,
    isReady: placesReady
  } = useModernGooglePlaces({ useNewAPI: true });

  // Update diagnostics status
  useEffect(() => {
    const status = getStatus();
    setDiagnosticsStatus(status);
  }, [isLoaded, isPlacesLoaded, getStatus]);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: API Key
    addTestResult({
      name: 'API Key Check',
      status: apiKey ? 'pass' : 'fail',
      message: apiKey ? 'API key is present' : 'API key is missing',
      details: { hasKey: !!apiKey }
    });

    // Test 2: Google Maps Loading
    addTestResult({
      name: 'Google Maps API Loading',
      status: isLoaded ? 'pass' : loadError ? 'fail' : 'running',
      message: isLoaded ? 'Google Maps API loaded successfully' : 
               loadError ? `Loading failed: ${loadError.message}` : 'Loading...',
      details: { isLoaded, loadError }
    });

    // Test 3: Places Library
    addTestResult({
      name: 'Places Library Check',
      status: isPlacesLoaded ? 'pass' : 'warning',
      message: isPlacesLoaded ? 'Places library loaded' : 'Places library not loaded',
      details: { isPlacesLoaded }
    });

    // Test 4: Basic Map Functionality
    if (isLoaded) {
      try {
        const success = await testFunctionality();
        addTestResult({
          name: 'Basic Map Functionality',
          status: success ? 'pass' : 'fail',
          message: success ? 'Map can be created successfully' : 'Map creation failed',
          details: { success }
        });
      } catch (error) {
        addTestResult({
          name: 'Basic Map Functionality',
          status: 'fail',
          message: `Map test failed: ${error}`,
          details: { error }
        });
      }
    }

    // Test 5: Modern Places API
    if (placesReady) {
      try {
        await searchPlaces('New York');
        setTimeout(() => {
          addTestResult({
            name: 'Modern Places API Search',
            status: placesError ? 'fail' : predictions.length > 0 ? 'pass' : 'warning',
            message: placesError ? `Search failed: ${placesError}` : 
                     predictions.length > 0 ? `Found ${predictions.length} results` : 'No results found',
            details: { predictions: predictions.length, error: placesError }
          });
        }, 1000);
      } catch (error) {
        addTestResult({
          name: 'Modern Places API Search',
          status: 'fail',
          message: `Places search failed: ${error}`,
          details: { error }
        });
      }
    }

    // Test 6: Place Details
    if (placesReady && predictions.length > 0) {
      try {
        const details = await getPlaceDetails(predictions[0].placeId);
        addTestResult({
          name: 'Place Details Fetch',
          status: details ? 'pass' : 'fail',
          message: details ? 'Place details retrieved successfully' : 'Failed to get place details',
          details: { details }
        });
      } catch (error) {
        addTestResult({
          name: 'Place Details Fetch',
          status: 'fail',
          message: `Place details failed: ${error}`,
          details: { error }
        });
      }
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      case 'running': return '🔄';
      default: return '⭕';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'fail': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">🗺️ Google Maps Test Suite</h1>
        
        {/* Quick Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">API Status</div>
            <div className={`font-semibold ${isLoaded ? 'text-green-600' : 'text-red-600'}`}>
              {isLoaded ? '✅ Loaded' : loadError ? '❌ Failed' : '🔄 Loading'}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Places API</div>
            <div className={`font-semibold ${isPlacesLoaded ? 'text-green-600' : 'text-yellow-600'}`}>
              {isPlacesLoaded ? '✅ Ready' : '⚠️ Not Loaded'}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">API Key</div>
            <div className={`font-semibold ${apiKey ? 'text-green-600' : 'text-red-600'}`}>
              {apiKey ? '✅ Present' : '❌ Missing'}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Modern Places</div>
            <div className={`font-semibold ${placesReady ? 'text-green-600' : 'text-yellow-600'}`}>
              {placesReady ? '✅ Ready' : '⚠️ Not Ready'}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={runTests}
            disabled={isRunning}
            className={`px-4 py-2 rounded-md font-medium ${
              isRunning 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? '🔄 Running Tests...' : '🧪 Run Tests'}
          </button>
          
          <button
            onClick={logDiagnostics}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
          >
            📊 Log Diagnostics
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(result.status)}</span>
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className={`text-sm ${getStatusColor(result.status)}`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
                
                {result.details && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto">
                    <pre>{JSON.stringify(result.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Diagnostics Status */}
        {diagnosticsStatus && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">System Diagnostics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Errors */}
              {diagnosticsStatus.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">🚨 Errors</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {diagnosticsStatus.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {diagnosticsStatus.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Warnings</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {diagnosticsStatus.warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {diagnosticsStatus.suggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Suggestions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {diagnosticsStatus.suggestions.map((suggestion, i) => (
                      <li key={i}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Places Test Results */}
        {predictions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Places Search Results</h3>
            <div className="space-y-2">
              {predictions.slice(0, 3).map((place, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="font-medium">{place.displayName}</div>
                  <div className="text-sm text-gray-600">{place.formattedAddress}</div>
                  <div className="text-xs text-gray-500">ID: {place.placeId}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapsTestSuite;