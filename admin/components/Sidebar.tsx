'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  FolderOpen,
  Wrench,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="sidebar-container glass-card">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <div className="logo-icon bg-gradient-to-br from-purple-500 to-blue-500">
            <LayoutDashboard size={24} color="#fff" />
          </div>
          <span className="logo-text">Dermcare Admin</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-label">Main Menu</p>
            <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link href="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>
              <BarChart3 size={20} />
              <span>Analytics</span>
            </Link>
          </div>

          <div className="nav-group">
            <p className="nav-label">Management</p>
            <Link href="/masterfiles" className={`nav-link ${isActive('/masterfiles') ? 'active' : ''}`}>
              <FolderOpen size={20} />
              <span>Masterfiles</span>
            </Link>
            <Link href="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`}>
              <Users size={20} />
              <span>Users</span>
            </Link>
            <Link href="/doctors" className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}>
              <Stethoscope size={20} />
              <span>Doctors</span>
            </Link>
            <Link href="/appointments" className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}>
              <Calendar size={20} />
              <span>Appointments</span>
            </Link>
          </div>

          <div className="nav-group">
            <p className="nav-label">System</p>
            <Link href="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
              <FileText size={20} />
              <span>Reports</span>
            </Link>
            <Link href="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .sidebar-container {
          width: var(--sidebar-width);
          height: calc(100vh - 40px);
          margin: 20px 0 20px 20px;
          display: flex;
          flex-direction: column;
          border-radius: 24px;
        }
        .sidebar-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px 32px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .logo-text {
          font-weight: 700;
          font-size: 18px;
          background: linear-gradient(90deg, #fff, rgba(255,255,255,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
        }
        .nav-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
          padding-left: 12px;
        }
        .logout-btn {
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          margin-top: auto;
        }
        .logout-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
