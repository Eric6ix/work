import { motion } from 'framer-motion';
export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ul>
        <li><a href="/">Início</a></li>
        <li><a href="/login">Login</a></li>
      </ul>
    </motion.nav>
  );
}
