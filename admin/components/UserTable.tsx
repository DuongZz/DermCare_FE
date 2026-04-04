import { MoreVertical, Edit2, Trash2, Plus, Download } from 'lucide-react';

const users = [
  { id: 1, name: 'Alerisan Anner', email: 'alerisan@defense.local', role: 'Team Member', status: 'Active', activeDate: '3/1/2026' },
  { id: 5, name: 'Corey Lim', email: 'corey@defense.local', role: 'Analyst', status: 'Active', activeDate: '2/28/2026' },
  { id: 2, name: 'Jaarm Demer', email: 'jaarm@defense.local', role: 'Team Member', status: 'Active', activeDate: '3/2/2026' },
  { id: 3, name: 'Jean Smith', email: 'jean@defense.local', role: 'Team Member', status: 'Inactive', activeDate: '2/21/2026' },
  { id: 6, name: 'Maya Vitto', email: 'maya@defense.local', role: 'Analyst', status: 'Inactive', activeDate: '2/9/2026' },
  { id: 4, name: 'Rina Solis', email: 'rina@defense.local', role: 'Manager', status: 'Active', activeDate: '3/2/2026' },
];

const UserTable = () => {
  return (
    <div className="table-container glass-card">
      <div className="table-header">
        <h2 className="table-title">User Management</h2>
        <div className="table-actions">
          <button className="btn btn-primary">
            <Plus size={18} />
            Add User
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="glass-table-row">
                <td className="id-col">{user.id}</td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="email-col">{user.email}</td>
                <td className="role-col">{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="date-col">{user.activeDate}</td>
                <td className="actions-col">
                  <div className="action-btns">
                    <button className="action-btn hover-blue" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn hover-red" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="showing-text">Showing 1-6 of {users.length}</span>
        <div className="pagination">
          <button className="page-btn">Prev</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">Next</button>
        </div>
      </div>

      <style jsx>{`
        .table-container {
          padding: 24px;
          margin: 20px;
          border-radius: 24px;
        }
        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .table-title {
          font-size: 20px;
          font-weight: 700;
        }
        .table-actions {
          display: flex;
          gap: 12px;
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .btn-primary {
          background: var(--accent-blue);
          color: #fff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .user-table th {
          padding: 16px;
          font-size: 12px;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .user-table td {
          padding: 16px;
          font-size: 14px;
        }
        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-purple);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .id-col { color: var(--text-secondary); }
        .email-col { color: var(--text-secondary); font-size: 13px; }
        .role-col { font-weight: 500; }
        .action-btns {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hover-blue:hover { color: var(--accent-blue); background: rgba(59, 130, 246, 0.1); }
        .hover-red:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
        
        .table-footer {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .showing-text {
          font-size: 13px;
          color: var(--text-secondary);
        }
        .pagination {
          display: flex;
          gap: 8px;
        }
        .page-btn {
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }
        .page-btn.active {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
        }
      `}</style>
    </div>
  );
};

export default UserTable;
