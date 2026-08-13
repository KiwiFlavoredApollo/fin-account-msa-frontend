import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="app-content">
          <AppRouter />
        </main>
      </div>
    </Router>
  );
}

export default App;
