const Box = ({ label, onClick, icon, gradient = "from-blue-600 to-blue-800" }) => {
  return (
    <div
      onClick={onClick}
      className={`
        group relative p-8 rounded-2xl bg-gradient-to-br ${gradient}
        shadow-lg hover:shadow-2xl 
        transform hover:scale-105 hover:-translate-y-2
        transition-all duration-300 
        cursor-pointer 
        overflow-hidden
        border border-gray-600/30
        animate-fade
      `}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white">
        {icon && (
          <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <h2 className="text-center text-xl font-semibold group-hover:text-white/90 transition-colors">
          {label}
        </h2>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default Box;