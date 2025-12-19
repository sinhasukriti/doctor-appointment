import React from 'react';
import ConversationFlow from './components/ConversationFlow';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🏥 Doctor Appointment Booking</h1>
        <p>Book your appointment with ease</p>
      </header>
      <main className="app-main">
        <ConversationFlow />
      </main>
    </div>
  );
}

export default App;

