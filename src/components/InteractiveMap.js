import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different building types
const createCustomIcon = (emoji, color = '#dc2626') => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${emoji}</div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const InteractiveMap = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [userLocation, setUserLocation] = useState([47.3769, 8.5417]); // Default: Zurich

  // Sample buildings data - replace with real data
  const buildings = [
    {
      id: 1,
      name: 'Rathaus',
      category: 'government',
      position: [47.3769, 8.5417],
      address: 'Rathausplatz 1, 8001 Zürich',
      description: 'Hier melden Sie sich zur Einbürgerung an',
      openingHours: 'Mo-Fr 8-12, 14-17 Uhr',
      contact: 'Tel: 044 412 31 11',
      historicalFacts: [
        'Erbaut im 17. Jahrhundert',
        'Sitz der Stadtregierung seit 1698'
      ],
      icon: createCustomIcon('🏛️', '#dc2626')
    },
    {
      id: 2,
      name: 'Grossmünster',
      category: 'culture',
      position: [47.3701, 8.5441],
      address: 'Grossmünsterplatz, 8001 Zürich',
      description: 'Wichtige protestantische Kirche und Wahrzeichen Zürichs',
      openingHours: 'Täglich 10-18 Uhr',
      contact: 'Tel: 044 252 59 49',
      historicalFacts: [
        'Erbaut zwischen 1100-1220',
        'Zentrum der Schweizer Reformation unter Huldrych Zwingli'
      ],
      icon: createCustomIcon('⛪', '#2563eb')
    },
    {
      id: 3,
      name: 'Hauptbahnhof Zürich',
      category: 'transport',
      position: [47.3784, 8.5401],
      address: 'Bahnhofplatz, 8001 Zürich',
      description: 'Grösster Bahnhof der Schweiz',
      openingHours: '24 Stunden geöffnet',
      contact: 'SBB Hotline: 0848 44 66 88',
      historicalFacts: [
        'Eröffnet 1847',
        'Täglich über 450.000 Reisende'
      ],
      icon: createCustomIcon('🚂', '#7c3aed')
    },
    {
      id: 4,
      name: 'Universität Zürich',
      category: 'education',
      position: [47.3739, 8.5506],
      address: 'Rämistrasse 71, 8006 Zürich',
      description: 'Grösste Universität der Schweiz',
      openingHours: 'Mo-Fr 7-22 Uhr',
      contact: 'Tel: 044 634 11 11',
      historicalFacts: [
        'Gegründet 1833',
        'Erste Universität Europas, die Frauen zum Studium zuliess'
      ],
      icon: createCustomIcon('🏫', '#059669')
    }
  ];

  const filters = [
    { key: 'all', label: 'Alle', icon: '🏢' },
    { key: 'government', label: 'Behörden', icon: '🏛️' },
    { key: 'culture', label: 'Kultur', icon: '⛪' },
    { key: 'education', label: 'Bildung', icon: '🏫' },
    { key: 'transport', label: 'Verkehr', icon: '🚂' }
  ];

  const filteredBuildings = activeFilter === 'all' 
    ? buildings 
    : buildings.filter(building => building.category === activeFilter);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied, using default location');
        }
      );
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
          Interaktive Karte
        </h2>
        <div className="flex space-x-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.key
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredBuildings.map((building) => (
            <Marker
              key={building.id}
              position={building.position}
              icon={building.icon}
              eventHandlers={{
                click: () => setSelectedBuilding(building)
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-lg mb-2">{building.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{building.address}</p>
                  <p className="text-sm mb-2">{building.description}</p>
                  <div className="text-xs text-gray-500">
                    <p><strong>Öffnungszeiten:</strong> {building.openingHours}</p>
                    <p><strong>Kontakt:</strong> {building.contact}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Building Details Panel */}
        {selectedBuilding && (
          <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10 max-h-64 overflow-y-auto">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {selectedBuilding.name}
              </h3>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>📍 Adresse:</strong> {selectedBuilding.address}</p>
              <p><strong>ℹ️ Beschreibung:</strong> {selectedBuilding.description}</p>
              <p><strong>🕒 Öffnungszeiten:</strong> {selectedBuilding.openingHours}</p>
              <p><strong>📞 Kontakt:</strong> {selectedBuilding.contact}</p>
              
              {selectedBuilding.historicalFacts && (
                <div>
                  <strong>📚 Historische Fakten:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {selectedBuilding.historicalFacts.map((fact, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{fact}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
