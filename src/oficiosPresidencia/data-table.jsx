import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FilePlus } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"

export function DataTable({ columns = [], data = [] }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleSearchChange = (e) => {
    setGlobalFilter(e.target.value)
    table.setPageIndex(0)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between py-4 px-4 bg-gray-200/90 border-2 border-solid border-gray">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Buscar..."
            value={globalFilter}
            onChange={handleSearchChange}
            className="max-w-sm bg-white"
          />
        </div>

        {user.role === 'ADMIN' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex flex-row items-center justify-center h-30px p-4 py-6 rounded-full bg-primary-green transition-colors hover:bg-emerald-600/80 whitespace-nowrap"
              onClick={() => navigate("/register-oficio-presidencia")}
            >
              <FilePlus className="text-white w-6" />
              <span className="primary-text text-sm ml-2 text-slate-100 hidden sm:inline">
                Registrar nuevo oficio
              </span>
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border-solid border-2 border-gray mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className='space-x-2 py-4 px-2 flex justify-between items-center footer-foreground'>
          <div className='flex-1 text-sm text-white'>
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>

          <div className='flex items-center justify-end space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 