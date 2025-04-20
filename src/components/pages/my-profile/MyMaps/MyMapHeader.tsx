import React from 'react';

const MyMapHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-semibold text-gray-800">Travel History</h1>
      <div className="flex items-center space-x-4">
        <select className="border rounded px-2 py-1 text-sm text-gray-600">
          <option>Recently</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm text-gray-600">
          <option>Sort by</option>
        </select>
      </div>
    </div>
  );
};

export default MyMapHeader;