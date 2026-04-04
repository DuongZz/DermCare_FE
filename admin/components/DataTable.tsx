import { Edit2, Trash2, Plus, Download, Search } from 'lucide-react';

interface Column {
  header: string;
  accessor: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onExport?: () => void;
  addButtonLabel?: string;
  searchPlaceholder?: string;
}

const DataTable = ({ 
  title, 
  columns, 
  data, 
  onAdd, 
  onExport, 
  addButtonLabel = 'Add Record',
  searchPlaceholder = 'Search records...' 
}: DataTableProps) => {
  return (
    <div className="table-container glass-card">
      <div className="table-top">
        <h2 className="table-title">{title}</h2>
        <div className="table-actions">
          {onAdd && (
            <button className="btn btn-primary" onClick={onAdd}>
              <Plus size={18} />
              {addButtonLabel}
            </button>
          )}
          {onExport && (
            <button className="btn btn-secondary" onClick={onExport}>
              <Download size={18} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="table-search glass-card">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder={searchPlaceholder} className="search-input" />
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="glass-table-row">
                {columns.map((col, cIdx) => (
                  <td key={cIdx}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
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
        <span className="showing-text">Showing 1-{data.length} of {data.length}</span>
        <div className="pagination">
          <button className="page-btn">Prev</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">Next</button>
        </div>
      </div>

      <style jsx>{`
        .table-container {
          padding: 24px;
          border-radius: 24px;
          margin: 20px;
        }
        .table-top {
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
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .table-search {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          gap: 12px;
          border-radius: 16px;
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.02);
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
        .table-wrapper {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          padding: 16px;
          font-size: 12px;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .data-table td {
          padding: 16px;
          font-size: 14px;
        }
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

export default DataTable;
