// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import { MoreHorizontal } from "lucide-react"
import { ArrowUp, ArrowDown } from 'lucide-react';


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom";

const myCustomFilterFn = (row, columnId, filterValue) => {
  const lowerFilterValue = filterValue.toLowerCase();
  const filterParts = lowerFilterValue.split(' ');

  let rowValues = Object.values(row.original).join(' ').toLowerCase();

  // Include office names in the rowValues
  if (row.original.offices && Array.isArray(row.original.offices)) {
    const officeNames = row.original.offices.map(office => office.office.name.toLowerCase()).join(' ');
    rowValues += ' ' + officeNames;
  }

  // Replace "en revision" with "pending"
  const statusReplacements = {
    "en": "pending",
    "proceso": "pending",
    "finalizado": "completed",
    "EN": "pending",
    "PROCESO": "pending",
    "FINALIZADO": "completed"
  };

  const modifiedFilterParts = filterParts.map(part => {
    return statusReplacements[part] || part;
  });

  return modifiedFilterParts.every((part) => rowValues.includes(part));
};

const SortedIcon = ({ isSorted = "asc" }) => {
  if (isSorted === 'asc') {
    return <ArrowUp className='h-4 w-4' />;
  } else if (isSorted === 'desc') {
    return <ArrowDown className='h-4 w-4' />;
  } else {
    return null;
  }
};

export const columns = (navigate) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="bg-white"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="bg-white"
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-green-700/80"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nº de Memo
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    filterFn: myCustomFilterFn,
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-green-700/80"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Asunto
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
  },
  {
    accessorKey: "applicant",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-green-700/80"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Solicitante
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
  },
  {
    accessorKey: "offices",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            className="bg-transparent hover:bg-green-700/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Gerencia u Oficina
            <SortedIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>

      );
    },
    cell: ({ row }) => {
      const offices = row.original.offices;
      return (
        <div className="text-center max-w-[250px]">
          {offices.map((office, index) => (
            <div key={index}>{office.office.name}</div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "reception_date",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-green-700/80"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.reception_date

      const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('es-ES', options);
      };

      return <div className="font-medium ">{formatDate(date)}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            className="bg-transparent hover:bg-green-700/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <SortedIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status")

      const formatStatus = {
        PENDING: "En proceso",
        COMPLETED: "Finalizado"
      }[status.toString()]

      const formatVariant = {
        PENDING: "pending",
        COMPLETED: "completed"
      }[status.toString()]

      return (<div className="text-center">

        <Badge variant={formatVariant}>	&#8226; {formatStatus}</Badge>
      </div>)
    },
  },
  {
    accessorKey: "response_require",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            className="bg-transparent hover:bg-green-700/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            RESP.
            <SortedIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const response = row.getValue("response_require")

      const formatResponse = {
        YES: "Sí",
        NO: "No"
      }[response.toString()]


      return (
        <div className="text-center">
          <span>{formatResponse}</span>
        </div>)
    },
  },
  {
    accessorKey: "observation",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            className="bg-transparent hover:bg-green-700/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Observación
            <SortedIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const observacion = row.getValue("observation")



      return (<div className="text-center max-w-[130px]">
        {observacion}
      </div>)
    },

  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {

      const id = row.getValue("id")

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex justify-center">
            <Button variant="ghost " className="h-8 w-8 p-0">
              <span className="sr-only">Abrir acciones</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/create-forum/${id.toLocaleLowerCase()}`)}>Abrir foro</DropdownMenuItem>
            <DropdownMenuItem>Cerrar foro</DropdownMenuItem>
            <DropdownMenuItem>Editar foro</DropdownMenuItem>
            <DropdownMenuItem>Cambiar status</DropdownMenuItem>
            <DropdownMenuItem>Editar registro</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },

]