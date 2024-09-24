import { useState } from "react"

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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

export function DataTable({ columns = [], data }) {
  const navigate = useNavigate()

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [currentStatus, setCurrentStatus] = useState('all');

  const handleStatusChange = (status = "") => {
    if (status === 'all') {
      table.getColumn('status')?.setFilterValue(undefined);
      setCurrentStatus('all');
      return;
    }

    const formatStatus = {
      pending: "En proceso",
      completed: "Finalizado"
    }[status]

    setCurrentStatus(status);
    table.getColumn('status')?.setFilterValue(status === 'all' ? '' : status);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4 px-4 bg-gray-200/90 border-2 mt-[-5px] mb-[-1px] border-solid border-gray">
        <div className="flex flex-row">
          <Input
            placeholder='Filtrar por...'
            value={(table.getColumn('asunto')?.getFilterValue()) ?? ''}
            onChange={(event) => {
              setCurrentStatus('all');
              table.getColumn('status')?.setFilterValue(undefined);
              table.getColumn('asunto')?.setFilterValue(event.target.value);
            }}
            className='max-w-sm bg-white '
          />
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className='w-[180px] ml-2 bg-white border-2'>
              <SelectValue placeholder='Status - All' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='pending'>En proceso</SelectItem>
                <SelectItem value='completed'>Finalizado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div> <Button variant="outline"
          className="flex flex-row items-center justify-center h-30px p-4 py-6 rounded-full bg-primary-green transition-colors hover:bg-emerald-600/80"
          onClick={() => navigate("/register-memo")}
        >
          <img src="/new_memo.png" alt="registro" width="40px" />
          <span className="primary-text text-sm ml-2 text-slate-100">Registrar <br />nuevo oficio</span>
        </Button></div>

      </div>

      <div className="rounded-md border-solid border-2 border-gray">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
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
          <div className='flex-1 text-sm text-black'>
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
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