import { useState, useEffect } from "react";
import "./index.css";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const DEFAULT_CITY = "Raleigh";
const FALLBACK_QUOTES = [
  {
    content:
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    content: "You miss 100% of the shots you don’t take.",
    author: "Wayne Gretzky",
  },
  {
    content: "Whether you think you can or you think you can’t, you’re right.",
    author: "Henry Ford",
  },
  {
    content:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    content: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
  {
    content: "Believe you can and you’re halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    content: "Act as if what you do makes a difference. It does.",
    author: "William James",
  },
  {
    content: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
  },
  {
    content: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
  },
  {
    content: "Don’t watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    content: "Everything you’ve ever wanted is on the other side of fear.",
    author: "George Addair",
  },
  {
    content: "Dream big and dare to fail.",
    author: "Norman Vaughan",
  },
  {
    content: "It always seems impossible until it’s done.",
    author: "Nelson Mandela",
  },
  {
    content: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
];
const FUN_FACTS = [
  "Honey never spoils.",
  "Bananas are berries, but strawberries aren't.",
  "A group of flamingos is called a 'flamboyance'.",
  "Octopuses have three hearts.",
  "The Eiffel Tower can be 15 cm taller during hot days.",
  "Wombat poop is cube-shaped.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Some cats are allergic to humans.",
  "A jiffy is an actual unit of time.",
  "The unicorn is the national animal of Scotland."
];
const MOTIVATIONAL_EMOJIS = [
  "🚀", "🌟", "🔥", "💡", "🎯", "💪", "✨", "🦾", "🧠", "🏆", "🛸", "🤖",
];

function getDayOfWeek(date) {
  return date.toLocaleDateString(undefined, { weekday: 'long' });
}

function getRandomEmoji() {
  return MOTIVATIONAL_EMOJIS[Math.floor(Math.random() * MOTIVATIONAL_EMOJIS.length)];
}

function getDateString(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getUptime(startTime) {
  const now = new Date();
  const diff = Math.floor((now - startTime) / 1000);
  const h = String(Math.floor(diff / 3600)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getSystemInfo() {
  return {
    browser: navigator.userAgent,
    os: navigator.platform,
    screen: `${window.screen.width}x${window.screen.height}`,
  };
}

function App() {
  // To-Do List State
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Daily Quote State
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  // Weather State
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [city, setCity] = useState(DEFAULT_CITY);

  // Clock State
  const [time, setTime] = useState(new Date());
  // Fun Fact State
  const [fact, setFact] = useState("");
  // Emoji State
  const [emoji, setEmoji] = useState(getRandomEmoji());
  const [startTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  // System Info State
  const [systemInfo, setSystemInfo] = useState(getSystemInfo());

  // Fetch Daily Quote
  useEffect(() => {
    setQuoteLoading(true);
    fetch("https://api.quotable.io/random?maxLength=100")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setQuote(data);
        setQuoteLoading(false);
      })
      .catch(() => {
        // Use a random fallback quote if API fails
        const fallback =
          FALLBACK_QUOTES[
            Math.floor(Math.random() * FALLBACK_QUOTES.length)
          ];
        setQuote(fallback);
        setQuoteLoading(false);
      });
  }, []);

  // Fetch Weather
  useEffect(() => {
    setWeatherLoading(true);
    setWeatherError(null);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${WEATHER_API_KEY}&units=imperial`
    )
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setWeatherLoading(false);
      })
      .catch(() => {
        setWeatherError("Could not fetch weather.");
        setWeatherLoading(false);
      });
  }, [city]);

  useEffect(() => {
    // Live clock interval
    const interval = setInterval(() => {
      setTime(new Date());
      setUptime((u) => u + 1);
    }, 1000);
    // Pick a random fun fact on mount
    setFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    setEmoji(getRandomEmoji());
    setSystemInfo(getSystemInfo());
    return () => clearInterval(interval);
  }, []);

  // To-Do List Handlers
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([{ text: input, done: false }, ...todos]);
      setInput("");
    }
  };

  const toggleTodo = (idx) => {
    setTodos(
      todos.map((todo, i) =>
        i === idx ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const removeTodo = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
  };

  return (
    <div
      className={
        "min-h-screen w-screen flex flex-col items-center justify-center p-2 md:p-4 transition-colors duration-500 relative overflow-hidden dark bg-gray-950"
      }
    >
      {/* Futuristic Animated Background with more movement */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <svg className="w-full h-full animate-fade-in" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bg1" cx="50%" cy="50%" r="80%" fx="50%" fy="50%" gradientTransform="rotate(20)">
              <stop offset="0%" stopColor="#00eaff" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bg2" cx="80%" cy="20%" r="60%" fx="80%" fy="20%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pulse1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00eaff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="1440" height="900" fill="url(#bg1)"/>
          <rect width="1440" height="900" fill="url(#bg2)"/>
          <g>
            <circle cx="1200" cy="200" r="80" fill="#00eaff" fillOpacity="0.08">
              <animate attributeName="r" values="80;120;80" dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="300" cy="700" r="120" fill="#38bdf8" fillOpacity="0.10">
              <animate attributeName="r" values="120;160;120" dur="8s" repeatCount="indefinite" />
            </circle>
            <ellipse cx="800" cy="450" rx="180" ry="60" fill="url(#pulse1)" opacity="0.12">
              <animate attributeName="rx" values="180;220;180" dur="7s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="600" cy="200" rx="60" ry="180" fill="url(#pulse1)" opacity="0.10">
              <animate attributeName="ry" values="180;120;180" dur="9s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </svg>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 md:mb-6 text-center drop-shadow-lg tracking-tight">
        Personal Dashboard <span className="ml-2 px-2 py-1 text-xs bg-green-500/80 text-black rounded shadow animate-pulse align-top">LIVE</span>
      </h1>
      <div className="w-full max-w-[1600px] grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-6 lg:gap-8 mb-4 md:mb-8">
        {/* To-Do List Widget */}
        <div className="bg-gray-900/80 rounded-xl p-4 md:p-6 shadow-glass col-span-2 flex flex-col backdrop-blur-md border border-cyan-400/20 min-h-[340px] max-h-[380px]">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4 tracking-tight">To-Do List</h2>
          <form onSubmit={addTodo} className="flex gap-2 mb-4">
            <input
              className="flex-1 rounded-lg px-4 py-2 bg-gray-900/80 dark:bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-accent text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-accent-hover transition shadow"
            >
              Add
            </button>
          </form>
          <ul className="flex-1 overflow-y-auto max-h-64 divide-y divide-gray-800">
            {todos.length === 0 && (
              <li className="text-gray-400 italic text-center py-8 animate-pulse">
                No tasks yet!
              </li>
            )}
            {todos.map((todo, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between py-2 group transition-all duration-300"
              >
                <span
                  className={`flex-1 cursor-pointer select-none transition-colors duration-200 ${
                    todo.done
                      ? "line-through text-gray-500"
                      : "text-white hover:text-accent"
                  }`}
                  onClick={() => toggleTodo(idx)}
                >
                  {todo.text}
                </span>
                <button
                  className="ml-4 text-red-400 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => removeTodo(idx)}
                  title="Delete"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Main Clock Widget (Prominent) */}
        <div className="bg-gray-900/80 rounded-xl p-4 shadow-glass flex flex-col items-center justify-center backdrop-blur-md border border-cyan-400/20 min-h-[120px] md:min-h-[180px] col-span-1">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">Current Time</h3>
          <div className="text-4xl md:text-5xl font-mono text-accent tracking-widest drop-shadow-lg">
            {time.toLocaleTimeString([], { hour12: false })}
          </div>
        </div>
        {/* System Info & Uptime */}
        <div className="bg-gray-900/80 rounded-xl p-4 shadow-glass flex flex-col items-center justify-center backdrop-blur-md border border-cyan-400/20 min-h-[120px] md:min-h-[180px] col-span-1">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">System Info</h3>
          <div className="text-gray-100 text-xs mb-1">Browser: <span className="text-cyan-200">{systemInfo.browser.split(') ')[0]})</span></div>
          <div className="text-gray-100 text-xs mb-1">OS: <span className="text-cyan-200">{systemInfo.os}</span></div>
          <div className="text-gray-100 text-xs mb-1">Screen: <span className="text-cyan-200">{systemInfo.screen}</span></div>
          <div className="text-gray-100 text-xs">Uptime: <span className="text-green-400">{String(Math.floor(uptime/3600)).padStart(2,'0')}:{String(Math.floor((uptime%3600)/60)).padStart(2,'0')}:{String(uptime%60).padStart(2,'0')}</span></div>
        </div>
        {/* Side Widgets (now in a horizontal row) */}
        <div className="col-span-4 grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6 mt-2">
          {/* Daily Quote */}
          <div className="bg-gray-900/80 rounded-xl p-3 shadow-glass flex flex-col items-center backdrop-blur-md border border-cyan-400/20 min-h-[100px]">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Daily Quote</h3>
            {quoteLoading && <div className="text-gray-400 animate-pulse">Loading...</div>}
            {quote && !quoteLoading && (
              <>
                <div className="text-gray-100 text-center italic mb-2 text-lg">"{quote.content}"</div>
                <div className="text-gray-400 text-sm text-right w-full">- {quote.author}</div>
              </>
            )}
          </div>
          {/* Fun Fact Widget */}
          <div className="bg-gray-900/80 rounded-xl p-3 shadow-glass flex flex-col items-center backdrop-blur-md border border-cyan-400/20 min-h-[80px]">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Fun Fact</h3>
            <div className="text-gray-100 text-center">{fact}</div>
          </div>
          {/* Emoji Widget */}
          <div className="bg-gray-900/80 rounded-xl p-3 shadow-glass flex flex-col items-center justify-center backdrop-blur-md border border-cyan-400/20 min-h-[80px] animate-bounce-slow">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Motivational Emoji</h3>
            <div className="text-4xl md:text-5xl lg:text-6xl select-none" aria-label="Motivational Emoji">{emoji}</div>
          </div>
          {/* Day of Week Widget */}
          <div className="bg-gray-900/80 rounded-xl p-3 shadow-glass flex flex-col items-center justify-center backdrop-blur-md border border-cyan-400/20 min-h-[80px]">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Today is</h3>
            <div className="text-2xl font-bold text-gray-100">{getDayOfWeek(time)}</div>
          </div>
          {/* Weather Widget */}
          <div className="bg-gray-900/80 rounded-xl p-3 shadow-glass flex flex-col items-center backdrop-blur-md border border-cyan-400/20 min-h-[100px] col-span-2">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Weather</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCity(e.target.city.value);
              }}
              className="flex gap-2 mb-2 w-full"
            >
              <input
                name="city"
                className="flex-1 rounded-lg px-2 py-1 bg-gray-900/80 dark:bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400 text-sm"
                placeholder="Enter city..."
                defaultValue={city}
              />
              <button
                type="submit"
                className="bg-accent text-gray-900 font-bold px-3 py-1 rounded-lg hover:bg-accent-hover transition text-sm"
              >
                Search
              </button>
            </form>
            {weatherLoading && <div className="text-gray-400 animate-pulse">Loading...</div>}
            {weatherError && <div className="text-red-400">{weatherError}</div>}
            {weather && !weatherLoading && !weatherError && weather.main && (
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">
                  {Math.round(weather.main.temp)}°F
                </div>
                <div className="text-gray-200 mb-1">{weather.weather[0].main}</div>
                <div className="text-gray-400 text-xs">
                  {weather.name}, {weather.sys.country}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Footer / Theme Switcher */}
      <div className="mt-4 md:mt-10 text-cyan-700 text-xs md:text-sm text-center">
        <span>Your Future is in Your Hands. <span className="animate-pulse">✨</span></span>
      </div>
    </div>
  );
}

export default App;
