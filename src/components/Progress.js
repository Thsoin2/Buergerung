import React, { useState, useEffect } from 'react';

const Progress = () => {
  const [stats, setStats] = useState({
    totalFacts: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    exploredBuildings: 0,
    categoryProgress: {
      geschichte: 0,
      politik: 0,
      geographie: 0,
      kultur: 0,
      lokales: 0
    }
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    // Load facts
    const facts = JSON.parse(localStorage.getItem('swisscitizen-facts') || '[]');
    
    // Load quiz results
    const quizResults = JSON.parse(localStorage.getItem('swisscitizen-quiz-results') || '[]');
    
    // Load explored buildings
    const exploredBuildings = JSON.parse(localStorage.getItem('swisscitizen-explored-buildings') || '[]');

    // Calculate statistics
    const totalQuizzes = quizResults.length;
    const totalAnswers = quizResults.reduce((sum, result) => sum + result.total, 0);
    const correctAnswers = quizResults.reduce((sum, result) => sum + result.score, 0);

    // Calculate category progress
    const categoryProgress = {
      geschichte: 0,
      politik: 0,
      geographie: 0,
      kultur: 0,
      lokales: 0
    };

    facts.forEach(fact => {
      if (categoryProgress.hasOwnProperty(fact.category)) {
        categoryProgress[fact.category]++;
      }
    });

    // Calculate recent activity
    const activity = [];
    
    // Add recent quiz results
    quizResults.slice(-5).forEach(result => {
      activity.push({
        type: 'quiz',
        date: new Date(result.date),
        description: `Quiz abgeschlossen: ${result.score}/${result.total} Punkte`,
        icon: '🧠',
        color: 'text-purple-600'
      });
    });

    // Add recent facts
    facts.slice(-3).forEach(fact => {
      activity.push({
        type: 'fact',
        date: new Date(fact.createdAt),
        description: `Neuer Fakt hinzugefügt: ${fact.title}`,
        icon: '📚',
        color: 'text-green-600'
      });
    });

    // Sort by date
    activity.sort((a, b) => b.date - a.date);

    setStats({
      totalFacts: facts.length,
      totalQuizzes,
      correctAnswers,
      totalAnswers,
      exploredBuildings: exploredBuildings.length,
      categoryProgress
    });

    setRecentActivity(activity.slice(0, 10));
  };

  const getSuccessRate = () => {
    if (stats.totalAnswers === 0) return 0;
    return Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
  };

  const getCategoryProgressPercentage = (category) => {
    const maxFacts = 20; // Assume 20 facts per category is 100%
    return Math.min((stats.categoryProgress[category] / maxFacts) * 100, 100);
  };

  const getOverallProgress = () => {
    const factProgress = Math.min((stats.totalFacts / 50) * 100, 100); // 50 facts = 100%
    const quizProgress = Math.min((stats.totalQuizzes / 20) * 100, 100); // 20 quizzes = 100%
    const buildingProgress = Math.min((stats.exploredBuildings / 10) * 100, 100); // 10 buildings = 100%
    
    return Math.round((factProgress + quizProgress + buildingProgress) / 3);
  };

  const categories = [
    { key: 'geschichte', label: 'Geschichte', icon: '🏛️', color: 'bg-blue-500' },
    { key: 'politik', label: 'Politik', icon: '🏛️', color: 'bg-red-500' },
    { key: 'geographie', label: 'Geographie', icon: '🗺️', color: 'bg-green-500' },
    { key: 'kultur', label: 'Kultur', icon: '🎭', color: 'bg-purple-500' },
    { key: 'lokales', label: 'Lokales Wissen', icon: '🏘️', color: 'bg-orange-500' }
  ];

  const achievements = [
    {
      title: 'Erste Schritte',
      description: 'Ersten Fakt hinzugefügt',
      icon: '🌟',
      unlocked: stats.totalFacts > 0,
      progress: Math.min(stats.totalFacts, 1)
    },
    {
      title: 'Quiz-Anfänger',
      description: 'Erstes Quiz abgeschlossen',
      icon: '🎯',
      unlocked: stats.totalQuizzes > 0,
      progress: Math.min(stats.totalQuizzes, 1)
    },
    {
      title: 'Wissensdurstig',
      description: '10 Fakten gesammelt',
      icon: '📖',
      unlocked: stats.totalFacts >= 10,
      progress: Math.min(stats.totalFacts / 10, 1)
    },
    {
      title: 'Quiz-Meister',
      description: '5 Quiz mit über 80% bestanden',
      icon: '🏆',
      unlocked: getSuccessRate() >= 80 && stats.totalQuizzes >= 5,
      progress: Math.min((stats.totalQuizzes >= 5 && getSuccessRate() >= 80 ? 1 : 0), 1)
    },
    {
      title: 'Entdecker',
      description: '5 Gebäude erkundet',
      icon: '🗺️',
      unlocked: stats.exploredBuildings >= 5,
      progress: Math.min(stats.exploredBuildings / 5, 1)
    },
    {
      title: 'Schweiz-Experte',
      description: 'Alle Kategorien zu 50% abgeschlossen',
      icon: '🇨🇭',
      unlocked: Object.values(stats.categoryProgress).every(count => count >= 10),
      progress: Math.min(Object.values(stats.categoryProgress).reduce((min, count) => Math.min(min, count / 10), 1), 1)
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Ihr Lernfortschritt
      </h1>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Gesamtfortschritt</h2>
          <div className="text-6xl font-bold mb-4">{getOverallProgress()}%</div>
          <div className="bg-white/20 rounded-full h-4 mb-4">
            <div
              className="bg-white rounded-full h-4 transition-all duration-500"
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
          <p className="text-red-100">
            Sie sind auf dem besten Weg zur Schweizer Einbürgerung!
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalFacts}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Fakten gelernt
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🧠</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalQuizzes}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Quiz absolviert
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {getSuccessRate()}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Erfolgsrate
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🗺️</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.exploredBuildings}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Orte erkundet
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Fortschritt nach Kategorien
          </h2>
          <div className="space-y-4">
            {categories.map(category => (
              <div key={category.key}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{category.icon}</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {category.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.categoryProgress[category.key]} Fakten
                  </span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`${category.color} rounded-full h-3 transition-all duration-500`}
                    style={{ width: `${getCategoryProgressPercentage(category.key)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Erfolge
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className={`text-2xl mr-3 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.unlocked 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.unlocked 
                      ? 'text-green-600 dark:text-green-300' 
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-600 dark:text-green-400">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Letzte Aktivitäten
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`text-xl mr-3 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.date.toLocaleDateString('de-CH')} um {activity.date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips for Improvement */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          💡 Tipps zur Verbesserung
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.totalFacts < 10 && (
            <div className="flex items-start">
              <span className="text-blue-500 mr-2">📚</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Fügen Sie mehr Fakten hinzu, um Ihr Wissen zu erweitern
              </p>
            </div>
          )}
          {getSuccessRate() < 70 && stats.totalQuizzes > 0 && (
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">🎯</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Wiederholen Sie schwierige Themen, um Ihre Erfolgsrate zu verbessern
              </p>
            </div>
          )}
          {stats.exploredBuildings < 5 && (
            <div className="flex items-start">
              <span className="text-green-500 mr-2">🗺️</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Erkunden Sie mehr Gebäude auf der interaktiven Karte
              </p>
            </div>
          )}
          {Object.values(stats.categoryProgress).some(count => count < 5) && (
            <div className="flex items-start">
              <span className="text-purple-500 mr-2">⚖️</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Konzentrieren Sie sich auf schwächere Kategorien für ausgewogenes Lernen
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
