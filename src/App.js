import React from 'react';
import TableDemo from './components/TableDemo'
import './App.css';

function App() {
  return (
    <div className="App">
        <div className="App-header">
            <h1>A Reusable React Table Demo</h1>
        </div>
        <div className="App-body">
            <div className="App-content-wrapper">
                <TableDemo />
            </div>
        </div>
    </div>
  );
}

export default App;
