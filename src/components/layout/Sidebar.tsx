import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  CheckSquare, 
  Users, 
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobileSidebar }) => {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';

  const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-primary text-white font-medium'
            : 'text-gray-700 hover:bg-primary/10'
        }`
      }
      onClick={() => {
        if (isMobileOpen) toggleMobileSidebar();
      }}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-primary">Taskly</h2>
            <button
              className="p-1 rounded-full hover:bg-gray-100 lg:hidden"
              onClick={toggleMobileSidebar}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem to="/dashboard" icon={<Home size={20} />} label="Dashboard" />
            <NavItem to="/calendar" icon={<Calendar size={20} />} label="Calendar" />
            <NavItem to="/tasks" icon={<CheckSquare size={20} />} label="Tasks" />
            
            {isManager && (
              <NavItem to="/employees" icon={<Users size={20} />} label="Employees" />
            )}
            
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;