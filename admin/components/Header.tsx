import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = ({ title }: { title: string }) => {
  return (
    <header className="header-container glass-card">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="search-box glass-card">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>

        <button className="icon-btn glass-card">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile glass-card">
          <div className="avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
          </div>
          <div className="user-info">
            <span className="user-name">Duong Admin</span>
            <span className="user-role">Super Admin</span>
          </div>
          <ChevronDown size={16} className="chevron" />
        </div>
      </div>

      <style jsx>{`
        .header-container {
          padding: 16px 32px;
          margin: 20px 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 700;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .search-box {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          gap: 12px;
          width: 300px;
          border-radius: 16px;
        }
        .search-input {
          background: none;
          border: none;
          color: #fff;
          outline: none;
          width: 100%;
          font-size: 14px;
        }
        .search-icon {
          color: rgba(255,255,255,0.4);
        }
        .icon-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .notification-dot {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid #1a1a3a;
        }
        .user-profile {
          display: flex;
          align-items: center;
          padding: 6px 16px 6px 8px;
          gap: 12px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-profile:hover {
          background: rgba(255,255,255,0.1);
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--accent-purple);
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 14px;
          font-weight: 600;
        }
        .user-role {
          font-size: 11px;
          color: var(--text-secondary);
        }
        .chevron {
          color: var(--text-secondary);
        }
      `}</style>
    </header>
  );
};

export default Header;
