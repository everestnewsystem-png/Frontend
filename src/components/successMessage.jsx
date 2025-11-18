const SuccessMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm mb-2 animate-fade">
      {message}
    </div>
  );
};

export default SuccessMessage;
