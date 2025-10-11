import { motion } from 'framer-motion';

const LoadingIndicator = () => {
  const colors = ['#3EB489', '#FFA62B', '#1C5D99'];

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Animated dots with wave effect */}
      <div className="flex items-center space-x-2 mb-3">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ scale: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full blur-sm"
              style={{ backgroundColor: color }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
            
            {/* Main dot */}
            <div
              className="w-3 h-3 rounded-full relative z-10"
              style={{ backgroundColor: color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Animated text */}
      <motion.div
        className="flex items-center space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-sm font-medium text-gray-600">Thinking</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.2 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.4 }}
        >
          .
        </motion.span>
      </motion.div>

      {/* Progress bar */}
      <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden mt-3">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

// Demo component to show the loader
const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Fab City Assistant
        </h3>
        <LoadingIndicator />
      </div>
    </div>
  );
};

export default Demo;