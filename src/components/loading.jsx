const Loading = () => {
  return (
    <div className="flex justify-center items-center h-64 animate-fade">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-12 h-12 border-4 border-gray-700 rounded-full"></div>
        
        {/* Inner spinning ring */}
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Pulse effect */}
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-ping opacity-75"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
      
      {/* Loading text */}
      <div className="ml-4">
        <div className="text-gray-400 font-medium">Loading...</div>
        <div className="text-gray-500 text-sm">Please wait</div>
      </div>
    </div>
  );
};

export default Loading;