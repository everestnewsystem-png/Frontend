const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm mb-2 animate-fade">
      {message}
    </div>
  );
};

export default ErrorMessage;
