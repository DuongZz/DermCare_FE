'use client';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';

const usersData = [
  { id: 1, name: 'Alerisan Anner', email: 'alerisan@defense.local', role: 'Team Member', status: 'Active', activeDate: '3/1/2026' },
  { id: 5, name: 'Corey Lim', email: 'corey@defense.local', role: 'Analyst', status: 'Active', activeDate: '2/28/2026' },
  { id: 2, name: 'Jaarm Demer', email: 'jaarm@defense.local', role: 'Team Member', status: 'Active', activeDate: '3/2/2026' },
  { id: 3, name: 'Jean Smith', email: 'jean@defense.local', role: 'Team Member', status: 'Inactive', activeDate: '2/21/2026' },
  { id: 6, name: 'Maya Vitto', email: 'maya@defense.local', role: 'Analyst', status: 'Inactive', activeDate: '2/9/2026' },
  { id: 4, name: 'Rina Solis', email: 'rina@defense.local', role: 'Manager', status: 'Active', activeDate: '3/2/2026' },
];

const columns = [
  { header: 'ID', accessor: 'id' },
  { 
    header: 'Name', 
    accessor: 'name',
    render: (row: any) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
          {row.name.charAt(0)}
        </div>
        <span style={{ fontWeight: '600' }}>{row.name}</span>
      </div>
    )
  },
  { header: 'Email', accessor: 'email' },
  { header: 'Role', accessor: 'role' },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (row: any) => (
      <span className={`status-badge ${row.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
        {row.status}
      </span>
    )
  },
  { header: 'Last Active', accessor: 'activeDate' },
];

export default function Users() {
  return (
    <main className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header title="User Management" />
        <div className="content-inner">
          <DataTable 
            title="Users"
            columns={columns}
            data={usersData}
            addButtonLabel="Add User"
            searchPlaceholder="Search users..."
            onAdd={() => {}}
            onExport={() => {}}
          />
        </div>
      </div>

      <style jsx>{`
        .dashboard-layout { display: flex; min-height: 100vh; }
        .main-content { flex: 1; display: flex; flex-direction: column; }
        .content-inner { padding: 0 12px 32px; }
        .status-badge { padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; }
        .status-active { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
        .status-inactive { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
      `}</style>
    </main>
  );
}
