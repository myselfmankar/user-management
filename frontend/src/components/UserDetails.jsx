// src/components/UserDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${encodeURIComponent(email)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to fetch user details');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-700">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error: {error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
        >
          Return to Users List
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-700">User not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">Return to Users List</Link>
      </div>
    );
  }

  // Split skills string into array
  const skillsList = user.skills.split(',').map(skill => skill.trim());

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0 bg-blue-50 p-6 flex justify-center items-start">
          {user.profile_picture ? (
            <img 
              src={user.profile_picture} 
              alt={`${user.name}'s profile`} 
              className="w-32 h-32 object-cover rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/128?text=No+Image';
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center
            // src/components/UserDetails.jsx (continued)
              justify-center">
              <span className="text-4xl text-gray-500">{user.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;