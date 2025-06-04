
import React, { Suspense } from "react";
import "./App.css";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./pages/ProductDetail/CartContext";
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Suspense fallback={<></>}>
          <Router />
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  );

}

export default App;
