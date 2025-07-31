import React, { useState, useEffect } from 'react';

const FactManager = () => {
  const [facts, setFacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFact, setEditingFact] = useState(null);
  const [newFact, setNewFact] = useState({
    title: '',
    content: '',
    category: 'geschichte',
    difficulty: 'mittel',
    tags: ''
  });

  const categories = [
    { key: 'all', label: 'Alle Kategorien', icon: '📚' },
    { key: 'geschichte', label: 'Geschichte', icon: '🏛️' },
    { key: 'politik', label: 'Politik', icon: '🏛️' },
    { key: 'geographie', label: 'Geographie', icon: '🗺️' },
    { key: 'kultur', label: 'Kultur', icon: '🎭' },
    { key: 'lokales', label: 'Lokales Wissen', icon: '🏘️' }
  ];

  const difficulties = [
    { key: 'einfach', label: 'Einfach', color: 'bg-green-100 text-green-800' },
    { key: 'mittel', label: 'Mittel', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'schwer', label: 'Schwer', color: 'bg-red-100 text-red-800' }
  ];

  // Sample facts data
  const sampleFacts = [
    {
      id: 1,
      title: 'Gründung der Schweiz',
      content: 'Die Schweiz wurde 1291 mit dem Bundesbrief gegründet, einem Bündnis zwischen Uri, Schwyz und Unterwalden.',
      category: 'geschichte',
      difficulty: 'mittel',
      tags: ['1291', 'Bundesbrief', 'Uri', 'Schwyz', 'Unterwalden'],
      createdAt: new Date('2025-01-01')
    },
    {
      id: 2,
      title: 'Bundesrat',
      content: 'Der Bundesrat ist die Regierung der Schweiz und besteht aus 7 Mitgliedern, die vom Parlament gewählt werden.',
      category: 'politik',
      difficulty: 'einfach',
      tags: ['Bundesrat', 'Regierung', '7 Mitglieder', 'Parlament'],
      createdAt: new Date('2025-01-02')
    },
    {
      id: 3,
      title: 'Schweizer Alpen',
      content: 'Die Alpen bedecken etwa 60% der Schweizer Landesfläche. Der höchste Berg ist die Dufourspitze mit 4634m.',
      category: 'geographie',
      difficulty: 'mittel',
      tags: ['Alpen', 'Dufourspitze', '4634m', 'Gebirge'],
      createdAt: new Date('2025-01-03')
    }
  ];

  useEffect(() => {
    // Load facts from localStorage or use sample data
    const savedFacts = localStorage.getItem('swisscitizen-facts');
    if (savedFacts) {
      setFacts(JSON.parse(savedFacts));
    } else {
      setFacts(sampleFacts);
      localStorage.setItem('swisscitizen-facts', JSON.stringify(sampleFacts));
    }
  }, []);

  const saveFacts = (updatedFacts) => {
    setFacts(updatedFacts);
    localStorage.setItem('swisscitizen-facts', JSON.stringify(updatedFacts));
  };

  const filteredFacts = facts.filter(fact => {
    const matchesSearch = fact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fact.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || fact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddFact = () => {
    if (newFact.title && newFact.content) {
      const fact = {
        id: Date.now(),
        ...newFact,
        tags: newFact.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date()
      };
      const updatedFacts = [...facts, fact];
      saveFacts(updatedFacts);
      setNewFact({ title: '', content: '', category: 'geschichte', difficulty: 'mittel', tags: '' });
      setShowAddForm(false);
    }
  };

  const handleEditFact = (fact) => {
    setEditingFact(fact);
    setNewFact({
      ...fact,
      tags: fact.tags.join(', ')
    });
    setShowAddForm(true);
  };

  const handleUpdateFact = () => {
    if (newFact.title && newFact.content) {
      const updatedFacts = facts.map(fact => 
        fact.id === editingFact.id 
          ? {
              ...newFact,
              id: editingFact.id,
              tags: newFact.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
              createdAt: editingFact.createdAt
            }
          : fact
      );
      saveFacts(updatedFacts);
      setNewFact({ title: '', content: '', category: 'geschichte', difficulty: 'mittel', tags: '' });
      setShowAddForm(false);
      setEditingFact(null);
    }
  };

  const handleDeleteFact = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Fakt löschen möchten?')) {
      const updatedFacts = facts.filter(fact => fact.id !== id);
      saveFacts(updatedFacts);
    }
  };

  const exportFacts = () => {
    const dataStr = JSON.stringify(facts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schweizer-fakten.json';
    link.click();
  };

  const importFacts = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedFacts = JSON.parse(e.target.result);
          saveFacts([...facts, ...importedFacts]);
          alert('Fakten erfolgreich importiert!');
        } catch (error) {
          alert('Fehler beim Importieren der Datei!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Fakten-Verwaltung
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={exportFacts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            📤 Export
          </button>
          <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer text-sm">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={importFacts}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            ➕ Neuer Fakt
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Fakten durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.key
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingFact ? 'Fakt bearbeiten' : 'Neuen Fakt hinzufügen'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titel
              </label>
              <input
                type="text"
                value={newFact.title}
                onChange={(e) => setNewFact({ ...newFact, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Titel des Fakts"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inhalt
              </label>
              <textarea
                value={newFact.content}
                onChange={(e) => setNewFact({ ...newFact, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Beschreibung des Fakts"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategorie
                </label>
                <select
                  value={newFact.category}
                  onChange={(e) => setNewFact({ ...newFact, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.key} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schwierigkeit
                </label>
                <select
                  value={newFact.difficulty}
                  onChange={(e) => setNewFact({ ...newFact, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.key} value={difficulty.key}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (durch Komma getrennt)
              </label>
              <input
                type="text"
                value={newFact.tags}
                onChange={(e) => setNewFact({ ...newFact, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Tag1, Tag2, Tag3"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={editingFact ? handleUpdateFact : handleAddFact}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {editingFact ? 'Aktualisieren' : 'Hinzufügen'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingFact(null);
                  setNewFact({ title: '', content: '', category: 'geschichte', difficulty: 'mittel', tags: '' });
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facts List */}
      <div className="space-y-4">
        {filteredFacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Keine Fakten gefunden. Fügen Sie neue Fakten hinzu oder ändern Sie Ihre Suchkriterien.
            </p>
          </div>
        ) : (
          filteredFacts.map(fact => (
            <div key={fact.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {fact.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditFact(fact)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteFact(fact.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {fact.content}
              </p>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  difficulties.find(d => d.key === fact.difficulty)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {difficulties.find(d => d.key === fact.difficulty)?.label}
                </span>
                
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {categories.find(c => c.key === fact.category)?.label}
                </span>
                
                {fact.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FactManager;
