import { useState, useEffect, useMemo } from "react"
import { memosService } from "@/services/memos.service";
import { useAuth } from "@/contexts/AuthContext";

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
import { FilePlus } from "lucide-react"

export function DataTable({ columns = [], data = [], onRefresh }) {

  const { user } = useAuth();

  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [currentStatus, setCurrentStatus] = useState('all');
  const [forumStatusFilter, setForumStatusFilter] = useState('all');

  // Memoize the filtered data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply status filter
    if (currentStatus !== 'all') {
      result = result.filter(item => item.status === currentStatus);
    }

    // Apply forum status filter
    if (forumStatusFilter !== 'all') {
      switch (forumStatusFilter) {
        case 'NO_FORUM':
          result = result.filter(item => !item.forum);
          break;
        case 'OPEN':
          result = result.filter(item => item.forum?.status === 'OPEN');
          break;
        case 'CLOSED':
          result = result.filter(item => item.forum?.status === 'CLOSED');
          break;
      }
    }

    // Apply global search filter
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      result = result.filter(item => {
        const searchableFields = [
          item.id,
          item.name,
          item.applicant,
          item.observation,
          ...(item.offices?.map(o => o.office.name) || []),
        ];
        return searchableFields.some(field =>
          String(field || '').toLowerCase().includes(searchTerm)
        );
      });
    }

    return result;
  }, [data, currentStatus, forumStatusFilter, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
  });

  const handleStatusChange = (value) => {
    setCurrentStatus(value);
    table.setPageIndex(0);
  };

  const handleForumStatusChange = (value) => {
    setForumStatusFilter(value);
    table.setPageIndex(0);
  };

  const handleSearchChange = (e) => {
    setGlobalFilter(e.target.value);
    table.setPageIndex(0);
  };

  const navigate = useNavigate();

  const canRegisterMemos = () => {
    return user.role === 'ADMIN' || user.office_id === '110';
  };

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

          <Select
            value={currentStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="hidden sm:block">Estado</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDING">Pendientes</SelectItem>
                <SelectItem value="COMPLETED">Completados</SelectItem>
                <SelectItem value="ARCHIVED">Archivados</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={forumStatusFilter}
            onValueChange={handleForumStatusChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="Foro" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="hidden sm:block">Estado del Foro</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="NO_FORUM">Sin Foro</SelectItem>
                <SelectItem value="OPEN">Abiertos</SelectItem>
                <SelectItem value="CLOSED">Cerrados</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {canRegisterMemos() && (
          <Button
            variant="outline"
            className="flex flex-row items-center justify-center h-30px p-4 py-6 rounded-full bg-primary-green transition-colors hover:bg-emerald-600/80 whitespace-nowrap"
            onClick={() => navigate("/register-memo")}
          >
            <FilePlus className="text-white w-6" />
            <span className="primary-text text-sm ml-2 text-slate-100 hidden sm:inline">
              Registrar nuevo oficio
            </span>
          </Button>
        )}
      </div>

      <div className="rounded-md border-solid border-2 border-gray mt-4">
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