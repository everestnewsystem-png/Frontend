import { createContext, useState, useContext } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (message) => setError(message);
  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}

      {error && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-red-600 text-white max-w-sm w-full mx-4 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p className="text-sm">{error}</p>
            <button
              onClick={clearError}
              className="mt-4 bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
