import React, { useState, useEffect } from 'react';

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [quizResults, setQuizResults] = useState([]);

  // Sample quiz questions
  const allQuestions = [
    {
      id: 1,
      question: 'In welchem Jahr wurde die Schweiz gegründet?',
      answers: ['1291', '1315', '1386', '1499'],
      correctAnswer: 0,
      category: 'geschichte',
      difficulty: 'einfach',
      explanation: 'Die Schweiz wurde 1291 mit dem Bundesbrief zwischen Uri, Schwyz und Unterwalden gegründet.',
      type: 'multiple-choice'
    },
    {
      id: 2,
      question: 'Wie viele Mitglieder hat der Bundesrat?',
      answers: ['5', '7', '9', '12'],
      correctAnswer: 1,
      category: 'politik',
      difficulty: 'einfach',
      explanation: 'Der Bundesrat besteht aus 7 Mitgliedern, die vom Parlament gewählt werden.',
      type: 'multiple-choice'
    },
    {
      id: 3,
      question: 'Die Schweiz hat vier Amtssprachen.',
      answers: ['Richtig', 'Falsch'],
      correctAnswer: 0,
      category: 'kultur',
      difficulty: 'einfach',
      explanation: 'Die vier Amtssprachen sind Deutsch, Französisch, Italienisch und Rätoromanisch.',
      type: 'true-false'
    },
    {
      id: 4,
      question: 'Welcher ist der höchste Berg der Schweiz?',
      answers: ['Matterhorn', 'Jungfrau', 'Dufourspitze', 'Piz Badile'],
      correctAnswer: 2,
      category: 'geographie',
      difficulty: 'mittel',
      explanation: 'Die Dufourspitze ist mit 4634 Metern der höchste Berg der Schweiz.',
      type: 'multiple-choice'
    },
    {
      id: 5,
      question: 'Wer war Huldrych Zwingli?',
      answers: ['Ein Politiker', 'Ein Reformator', 'Ein Künstler', 'Ein Wissenschaftler'],
      correctAnswer: 1,
      category: 'geschichte',
      difficulty: 'schwer',
      explanation: 'Huldrych Zwingli war ein wichtiger Reformator der Schweizer Reformation im 16. Jahrhundert.',
      type: 'multiple-choice'
    }
  ];

  const categories = [
    { key: 'all', label: 'Alle Kategorien' },
    { key: 'geschichte', label: 'Geschichte' },
    { key: 'politik', label: 'Politik' },
    { key: 'geographie', label: 'Geographie' },
    { key: 'kultur', label: 'Kultur' }
  ];

  const difficulties = [
    { key: 'all', label: 'Alle Schwierigkeiten' },
    { key: 'einfach', label: 'Einfach' },
    { key: 'mittel', label: 'Mittel' },
    { key: 'schwer', label: 'Schwer' }
  ];

  const [currentQuestions, setCurrentQuestions] = useState([]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted]);

  const filterQuestions = () => {
    return allQuestions.filter(q => {
      const categoryMatch = selectedCategory === 'all' || q.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  };

  const startQuiz = (withTimer = false) => {
    const filtered = filterQuestions();
    if (filtered.length === 0) {
      alert('Keine Fragen für die gewählten Kriterien gefunden!');
      return;
    }
    
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
    setScore(0);
    setQuizResults([]);
    
    if (withTimer) {
      setTimeLeft(30); // 30 seconds per question
    } else {
      setTimeLeft(null);
    }
  };

  const handleTimeUp = () => {
    setSelectedAnswer(null);
    setShowResults(true);
  };

  const selectAnswer = (answerIndex) => {
    if (!showResults) {
      setSelectedAnswer(answerIndex);
    }
  };

  const checkAnswer = () => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setQuizResults([...quizResults, {
      question: currentQuestion,
      selectedAnswer,
      isCorrect
    }]);
    
    setShowResults(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResults(false);
      if (timeLeft !== null) {
        setTimeLeft(30);
      }
    }
  };

  const finishQuiz = () => {
    // Save quiz results to localStorage
    const savedResults = JSON.parse(localStorage.getItem('swisscitizen-quiz-results') || '[]');
    const newResult = {
      date: new Date().toISOString(),
      score,
      total: currentQuestions.length,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      results: quizResults
    };
    savedResults.push(newResult);
    localStorage.setItem('swisscitizen-quiz-results', JSON.stringify(savedResults));
    
    setQuizStarted(false);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
    setScore(0);
    setTimeLeft(null);
    setQuizResults([]);
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Quiz-System
        </h1>

        <div className="max-w-2xl mx-auto">
          {/* Quiz Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Quiz konfigurieren
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
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
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
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
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Verfügbare Fragen: {filterQuestions().length}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => startQuiz(false)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  disabled={filterQuestions().length === 0}
                >
                  🧠 Quiz starten
                </button>
                <button
                  onClick={() => startQuiz(true)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                  disabled={filterQuestions().length === 0}
                >
                  ⏱️ Quiz mit Timer
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Ihre Statistiken
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quiz absolviert</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">0%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Erfolgsrate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Beste Serie</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">-</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lieblingskategorie</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Frage {currentQuestionIndex + 1} von {currentQuestions.length}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Punkte: {score}/{currentQuestions.length}
              </p>
            </div>
            <div className="text-right">
              {timeLeft !== null && (
                <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                  ⏱️ {timeLeft}s
                </div>
              )}
              <button
                onClick={resetQuiz}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Quiz beenden
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 fade-in">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-3 mb-6">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                disabled={showResults}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? showResults
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : showResults && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-400'
                } ${showResults ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {answer}
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            {!showResults ? (
              <button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                Antwort prüfen
              </button>
            ) : (
              <div className="text-center">
                {currentQuestionIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Nächste Frage →
                  </button>
                ) : (
                  <button
                    onClick={finishQuiz}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Quiz beenden
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Feedback */}
          {showResults && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`text-lg font-semibold mb-2 ${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {selectedAnswer === currentQuestion.correctAnswer ? '✅ Richtig!' : '❌ Falsch!'}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
