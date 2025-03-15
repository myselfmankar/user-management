// src/components/UsersList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-700">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <p>Make sure your backend server is running at http://localhost:5000</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-700">No users found. <Link to="/add-user" className="text-blue-600 hover:underline">Add a user</Link>.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users List</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Link 
            to={`/user/${encodeURIComponent(user.email)}`} 
            key={user.email}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center mb-4">
                {user.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt={`${user.name}'s profile`} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <span className="text-xl text-gray-500">{user.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Skills:</h4>
                <p className="text-gray-700">{user.skills}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UsersList;