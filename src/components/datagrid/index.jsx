import React from 'react';

export default function DataTable({
  rows,
  columns,
  rowSelectionModel = [],
  onRowSelectionModelChange,
  checkboxSelection = true,
  emptyText = "No data available",
  ...props
}) {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = rows.map((r) => r.id);
      onRowSelectionModelChange(allIds);
    } else {
      onRowSelectionModelChange([]);
    }
  };

  const handleSelectRow = (id) => {
    if (rowSelectionModel.includes(id)) {
      onRowSelectionModelChange(rowSelectionModel.filter((item) => item !== id));
    } else {
      onRowSelectionModelChange([...rowSelectionModel, id]);
    }
  };

  const isSelected = (id) => rowSelectionModel.includes(id);
  const allSelected = rows.length > 0 && rowSelectionModel.length === rows.length;
  const indeterminate = rowSelectionModel.length > 0 && rowSelectionModel.length < rows.length;

  return (
    <div className="overflow-x-auto w-full h-96 border border-[var(--surface-3)] rounded-lg bg-[var(--surface-2)]">
      <table className="table table-zebra table-pin-rows w-full text-[var(--praestitia-text)]">
        <thead>
          <tr className="bg-[var(--surface-1)] text-[var(--praestitia-text)] border-b border-[var(--surface-3)]">
            {checkboxSelection && (
              <th className="w-12 bg-[var(--surface-1)]">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary rounded border-[var(--surface-3)]"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = indeterminate;
                    }}
                    onChange={handleSelectAll}
                  />
                </label>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.field}
                className="bg-[var(--surface-1)] text-sm font-bold uppercase tracking-wider"
                style={{ width: col.width, minWidth: col.minWidth, flex: col.flex }}
              >
                {col.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={checkboxSelection ? columns.length + 1 : columns.length}
                className="text-center py-10 opacity-70"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-[var(--surface-3)] border-b border-[var(--surface-3)/50] ${isSelected(row.id) ? 'bg-[var(--surface-3)]' : ''}`}
              >
                {checkboxSelection && (
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary rounded border-[var(--surface-3)]"
                        checked={isSelected(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </label>
                  </th>
                )}
                {columns.map((col) => (
                  <td key={`${row.id}-${col.field}`} className="whitespace-nowrap">
                    {row[col.field]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
