import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 z-10 lg:left-64">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 lg:hidden"
            onClick={toggleMobileSidebar}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 lg:hidden">Taskly</h1>
        </div>

        <div className="flex items-center gap-4">
         

          <div className="relative">
            <button 
              className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;