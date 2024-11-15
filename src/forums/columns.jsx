// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import { MoreHorizontal, ArrowUp, ArrowDown, Lock, Unlock, FileImage, Eye } from "lucide-react"
import { useState, useEffect } from 'react';

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
import axios from "axios";
import { cn } from "@/lib/utils"

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

export const columns = ({ navigate, toast, setRefresh }) => [
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
    cell: ({ row }) => {
      return <Badge>{row.original.id}</Badge>
    }
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
      const status = row.getValue("status");
      const forumStatus = row.original.forumStatus; // We'll need to add this to the memo query

      return (
        <div className="text-center space-y-1">
          <Badge variant={status === "PENDING" ? "pending" : "completed"}>
            &#8226; {status === "PENDING" ? "En proceso" : "Finalizado"}
          </Badge>
          {forumStatus && (
            <Badge
              variant={forumStatus === "OPEN" ? "outline" : "destructive"}
              className="text-xs"
            >
              Foro {forumStatus === "OPEN" ? "Abierto" : "Cerrado"}
            </Badge>
          )}
        </div>
      );
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
    accessorKey: "reception_images",
    header: "Recepción",
    cell: ({ row }) => {
      const images = row.original.reception_images;

      const handleViewImage = (image) => {
        // For PDFs, open in new tab
        if (image.isPdf) {
          window.open(`http://localhost:3000/${image.path}`, '_blank');
          return;
        }

        // For images, create a modal or new window to view
        const imageUrl = `http://localhost:3000/${image.path}`;
        window.open(imageUrl, '_blank', 'width=800,height=600');
      };

      return (
        <div className="flex justify-center gap-2">
          {images && images.map((image, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={() => handleViewImage(image)}
              className="hover:bg-green-700/20"
              title={image.filename}
            >
              {image.isPdf ? (
                <FileImage className="h-5 w-5 text-blue-500" />
              ) : (
                <Eye className="h-5 w-5 text-green-600" />
              )}
            </Button>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const [forumStatus, setForumStatus] = useState(null);
      const [forumId, setForumId] = useState(null);
      const [isLoading, setIsLoading] = useState(true);
      const id = row.getValue("id");
      const status = row.getValue("status");

      useEffect(() => {
        const checkForumStatus = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/forums/check-existence/${id}`);
            if (response.data.exists) {
              setForumStatus(response.data.status);
              setForumId(response.data.id);
            }
            setIsLoading(false);
          } catch (error) {
            console.error('Error checking forum status:', error);
            setIsLoading(false);
          }
        };

        checkForumStatus();
      }, [id]);

      const handleChangeStatus = async () => {
        const newStatus = status === "PENDING" ? "COMPLETED" : "PENDING";
        try {
          await axios.patch(`http://localhost:3000/memos/${id}/status`, { status: newStatus });
          toast.success(`${id}: Status actualizado a ${newStatus === "COMPLETED" ? "Finalizado" : "En proceso"}`);
          setRefresh(prev => !prev);
        } catch (error) {
          toast.error('Error cambiando el status. Contacte a Soporte.');
          console.error('Failed to change status:', error);
        }
      };

      const handleForumStatus = async () => {
        if (!forumId) {
          toast.error('No existe un foro para este memo');
          return;
        }

        try {
          const newStatus = forumStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
          await axios.patch(`http://localhost:3000/forums/${forumId}/status`, { status: newStatus });
          setForumStatus(newStatus);
          toast.success(`Foro ${newStatus === 'OPEN' ? 'abierto' : 'cerrado'} exitosamente`);
          setRefresh(prev => !prev);
        } catch (error) {
          toast.error('Error al cambiar el estado del foro');
          console.error('Error:', error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex justify-center">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir acciones</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/check-forum/${id.toLowerCase()}`)}>
              Abrir foro
            </DropdownMenuItem>
            {!isLoading && forumId && (
              <DropdownMenuItem
                onClick={handleForumStatus}
                className={cn(
                  forumStatus === 'OPEN'
                    ? "text-red-600 hover:text-red-700"
                    : "text-green-600 hover:text-green-700"
                )}
              >
                {forumStatus === 'OPEN' ? (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Cerrar foro</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    <span>Reabrir foro</span>
                  </div>
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleChangeStatus}>
              Cambiar status
            </DropdownMenuItem>
            <DropdownMenuItem>
              Editar registro
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

]