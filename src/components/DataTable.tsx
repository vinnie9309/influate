import type { ReactNode } from "react"

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: readonly Column<T>[]
  rows: readonly T[]
  rowKey: (row: T) => string
  /** Below this width the table scrolls sideways instead of squashing. */
  minWidth?: number
}

/** A horizontally scrollable table built from column definitions. */
export default function DataTable<T>({ columns, rows, rowKey, minWidth = 560 }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm" style={{ minWidth }}>
        <thead>
          <tr className="text-left text-muted">
            {columns.map(({ header }, i) => (
              <th key={i} scope="col" className="border-b border-line px-2 py-2.5 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-mist last:border-0">
              {columns.map(({ cell, className = "" }, i) => (
                <td key={i} className={`px-2 py-3 ${className}`}>
                  {cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
