const Button = ({ text, onClick, className = "", disabled = false, variant = "primary" }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
    danger: "bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white shadow-lg",
    success: "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-600 hover:border-gray-500"
  };

  const disabledClasses = "bg-gray-600 text-gray-400 cursor-not-allowed transform-none shadow-none";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${disabled ? disabledClasses : variants[variant]}
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default Button;