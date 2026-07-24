import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-24">
      <motion.div
        className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;
