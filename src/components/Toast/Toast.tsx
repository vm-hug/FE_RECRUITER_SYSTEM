import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import "./Toast.scss";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="toast"
        >
          <div className="toast__icon-wrapper">
            <CheckCircle className="toast__icon" size={20} />
          </div>
          <span className="toast__message">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
