
import React, { Suspense } from "react";
import "./App.css";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<></>}>
        <Router />
      </Suspense>
    </BrowserRouter>

  );

}

export default App;
