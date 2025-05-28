import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Input } from '../../../../components/ui/input';
import { X, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

const UserSearchSelect = ({ selectedUsers, setSelectedUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuth();
  
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users?search=${query}`, {
        credentials: "include",
        headers: {
          "Accept": "application/json",
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
      
      const data = await response.json();
      
      // Filter out the current user and already selected users
      const filteredUsers = data.filter(user => 
        user._id !== authUser?._id && 
        !selectedUsers.some(selectedUser => selectedUser._id === user._id)
      );
      
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Search users error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const handleSelect = (user) => {
    if (!selectedUsers.some(u => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  const handleRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedUsers.map(user => (
          <Badge key={user._id} variant="secondary" className="flex items-center gap-1 py-1 px-2">
            <Avatar className="h-4 w-4 mr-1">
              <AvatarImage src={user.profileImg} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            {user.fullName}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => handleRemove(user._id)}
            />
          </Badge>
        ))}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="border rounded-md max-h-40 overflow-y-auto">
          {searchResults.map(user => (
            <div
              key={user._id}
              onClick={() => handleSelect(user)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImg} alt={user.fullName} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {searchTerm && searchResults.length === 0 && !loading && (
        <p className="text-sm text-gray-500 py-1">No users found</p>
      )}
    </div>
  );
};

export default UserSearchSelect;
