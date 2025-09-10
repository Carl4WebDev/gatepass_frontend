// src/components/ErrorModal.jsx
import { useError } from "../hooks/useError";

const ErrorModal = () => {
  const { error, clearError } = useError();

  if (!error) return null; // No error → don't render

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="bg-white w-80 rounded-lg shadow-lg p-6 border-2 border-black">
        <h2 className="text-lg font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={clearError}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
