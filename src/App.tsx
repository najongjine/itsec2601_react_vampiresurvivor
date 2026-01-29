import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Calc from "./Calc";
import { AuthProvider } from "./context/AuthContext";
import SplashCursor from "./Component/reactbits/SplashCursor";
import Game from "./Game";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <SplashCursor />
          <Routes>
            <Route path="/" element={<Calc />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
