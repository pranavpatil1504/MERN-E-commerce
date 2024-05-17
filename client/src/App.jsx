import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Men from './components/men';
import Women from './components/women';
import Kids from './components/kids';
import Homeliving from './components/home&living';
import Beauty from './components/beauty';
import Cart from './components/Cart';
import { CartProvider } from './components/CartContext';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Header component */}
        </header>
        <main>
        <CartProvider>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/men" element={<Men/>} />
            <Route path="/women" element={<Women/>} />
            <Route path="/kids" element={<Kids/>} />
            <Route path="/home&living" element={<Homeliving/>} />
            <Route path="/beauty" element={<Beauty/>} />
            <Route exact path="/cart" element={<Cart />} />
            {/* Add other routes here */}
          </Routes>
        </CartProvider>
        </main>
        <footer>
          {/* Footer component */}
        </footer>
      </div>
    </Router>
  );
}

export default App;
