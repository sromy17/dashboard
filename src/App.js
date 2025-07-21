import { useState, useEffect } from "react";
import "./index.css";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const DEFAULT_CITY = "Raleigh";

function App() {
  // To-Do List State
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(true);

  // Daily Quote State
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(null);

  // Weather State
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [city, setCity] = useState(DEFAULT_CITY);

  // Fetch Daily Quote
  useEffect(() => {
    setQuoteLoading(true);
    setQuoteError(null);
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
        setQuoteError("Could not fetch quote. Try refreshing.");
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
      className={`${
        dark ? "dark" : ""
      } min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800`}
    >
      <div className="absolute top-4 right-4">
        <button
          className="rounded-full px-4 py-2 bg-accent text-gray-900 font-bold shadow hover:bg-accent-hover transition"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-accent mb-6 text-center drop-shadow-lg">
        Personal Dashboard
      </h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To-Do List Widget */}
        <div className="bg-white/10 dark:bg-white/5 rounded-xl p-6 shadow-glass col-span-2 flex flex-col backdrop-blur-xs border border-white/20">
          <h2 className="text-2xl font-semibold text-accent mb-4">To-Do List</h2>
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
        {/* Side Widgets */}
        <div className="flex flex-col gap-6">
          {/* Daily Quote */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-4 shadow-glass flex flex-col items-center backdrop-blur-xs border border-white/20 min-h-[120px]">
            <h3 className="text-lg font-semibold text-accent mb-2">Daily Quote</h3>
            {quoteLoading && <div className="text-gray-400 animate-pulse">Loading...</div>}
            {quoteError && <div className="text-red-400">{quoteError}</div>}
            {quote && !quoteLoading && !quoteError && (
              <>
                <div className="text-gray-100 text-center italic mb-2">"{quote.content}"</div>
                <div className="text-gray-400 text-sm text-right w-full">- {quote.author}</div>
              </>
            )}
          </div>
          {/* Weather Widget */}
          <div className="bg-white/10 dark:bg-white/5 rounded-xl p-4 shadow-glass flex flex-col items-center backdrop-blur-xs border border-white/20 min-h-[120px]">
            <h3 className="text-lg font-semibold text-accent mb-2">Weather</h3>
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
                <div className="text-2xl font-bold text-accent mb-1">
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
      {/* Footer / Dark mode toggle placeholder */}
      <div className="mt-10 text-gray-500 text-sm">
        Dark mode & more widgets coming soon!
      </div>
    </div>
  );
}

export default App;
