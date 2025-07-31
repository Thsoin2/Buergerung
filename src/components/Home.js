import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // Themenbereiche für die Schweizer Einbürgerung
  const topics = [
    {
      id: 'history',
      title: 'Geschichte',
      icon: '📜',
      description: 'Schweizer Geschichte von den Anfängen bis zur Gegenwart',
      color: 'bg-red-100 dark:bg-red-900',
      link: '/facts?category=history'
    },
    {
      id: 'politics',
      title: 'Politik',
      icon: '🏛️',
      description: 'Politisches System, Demokratie und Föderalismus',
      color: 'bg-blue-100 dark:bg-blue-900',
      link: '/facts?category=politics'
    },
    {
      id: 'geography',
      title: 'Geografie',
      icon: '🏔️',
      description: 'Kantone, Städte, Berge und Gewässer',
      color: 'bg-green-100 dark:bg-green-900',
      link: '/facts?category=geography'
    },
    {
      id: 'culture',
      title: 'Kultur',
      icon: '🎭',
      description: 'Traditionen, Feste und kulturelle Besonderheiten',
      color: 'bg-yellow-100 dark:bg-yellow-900',
      link: '/facts?category=culture'
    },
    {
      id: 'local',
      title: 'Lokales Wissen',
      icon: '🏘️',
      description: 'Informationen über Ihre Gemeinde und Ihren Kanton',
      color: 'bg-purple-100 dark:bg-purple-900',
      link: '/facts?category=local'
    },
    {
      id: 'quiz',
      title: 'Quiz',
      icon: '❓',
      description: 'Testen Sie Ihr Wissen mit verschiedenen Quizfragen',
      color: 'bg-pink-100 dark:bg-pink-900',
      link: '/quiz'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero-Bereich */}
      <section className="text-center py-8 px-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Willkommen bei SwissCitizen Prep</h1>
        <p className="text-xl mb-6">
          Ihre interaktive Lernplattform zur Vorbereitung auf das Schweizer Einbürgerungsgespräch
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/map" className="bg-white text-red-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
            Karte erkunden
          </Link>
          <Link to="/quiz" className="bg-red-800 text-white px-6 py-2 rounded-full font-medium hover:bg-red-900 transition-colors">
            Quiz starten
          </Link>
        </div>
      </section>

      {/* Themenbereiche */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">Themenbereiche</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link 
              key={topic.id}
              to={topic.link}
              className={`card-hover p-6 rounded-lg shadow-md ${topic.color} dark:text-white transition-all`}
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">{topic.icon}</span>
                <h3 className="text-xl font-semibold">{topic.title}</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{topic.description}</p>
              <div className="mt-4 flex justify-end">
                <span className="text-red-600 dark:text-red-400 font-medium">Mehr erfahren →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tipps-Bereich */}
      <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Tipps für die Vorbereitung</h2>
        <ul className="space-y-3 list-disc pl-5">
          <li>Nutzen Sie die interaktive Karte, um wichtige Orte in Ihrer Gemeinde kennenzulernen</li>
          <li>Lernen Sie regelmäßig mit den Fakten aus verschiedenen Kategorien</li>
          <li>Testen Sie Ihr Wissen mit dem Quiz und wiederholen Sie schwierige Fragen</li>
          <li>Verfolgen Sie Ihren Fortschritt im Dashboard</li>
          <li>Speichern Sie die App auf Ihrem Startbildschirm für schnellen Zugriff</li>
        </ul>
      </section>

      {/* Schnellzugriff */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/map" className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <span className="block text-3xl mb-2">🗺️</span>
            <span className="font-medium">Karte</span>
          </Link>
          <Link to="/facts" className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <span className="block text-3xl mb-2">📚</span>
            <span className="font-medium">Fakten</span>
          </Link>
          <Link to="/quiz" className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <span className="block text-3xl mb-2">❓</span>
            <span className="font-medium">Quiz</span>
          </Link>
          <Link to="/progress" className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <span className="block text-3xl mb-2">📊</span>
            <span className="font-medium">Fortschritt</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
