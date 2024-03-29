import Navbar from "./components/Navbar";
import Herosection from "./components/herosection";
import About from "./components/About/about";

// Inside App.jsx
import { Routes, Route } from "react-router-dom"; // Import Routes
import Contact from "./components/contact/contact";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes> {/* Wrap your Route components within Routes */}
        <Route  path="/" element={<Herosection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
};


export default App;

