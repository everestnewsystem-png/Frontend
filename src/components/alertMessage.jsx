const AlertMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-3 bg-blue-100 text-blue-800 rounded-md text-sm mb-2 animate-fade">
      {message}
    </div>
  );
};

export default AlertMessage;
