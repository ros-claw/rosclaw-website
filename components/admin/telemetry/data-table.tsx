"use client";

interface DataTableProps {
  columns: { key: string; label: string }[];
  rows: Record<string, string | number | null | undefined>[];
}

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-white/50 border-b border-white/[0.08]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="pb-3 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white/80">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-6 text-white/40 text-center">
                No data yet
              </td>
            </tr>
          )}
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-white/[0.04] last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="py-3">{row[col.key] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
