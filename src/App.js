import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { ShopContextProvider } from "./context/shop-context";
import { routes } from "./routes";

function App() {
  return (
    <div className="App">
      <ShopContextProvider>
        <Router>
          <Navbar />
          <Routes>
            {routes.map((route) => (
              <Route
                path={route.path}
                element={<route.page />}
              />
            ))}
          </Routes>
        </Router>
      </ShopContextProvider>
    </div>
  );
}

export default App;