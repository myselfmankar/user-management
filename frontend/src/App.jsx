// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddUserForm from './components/AddUserForm';
import UsersList from './components/UsersList';
import UserDetails from './components/UserDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">User Management</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:text-blue-200">Home</Link>
              <Link to="/add-user" className="hover:text-blue-200">Add User</Link>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<UsersList />} />
            <Route path="/add-user" element={<AddUserForm />} />
            <Route path="/user/:email" element={<UserDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;