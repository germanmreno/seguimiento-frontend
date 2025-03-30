// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import { MoreHorizontal, ArrowUp, ArrowDown, Lock, Unlock, FileImage, Eye, FileText, MessageCircle, Check, RotateCcw, Circle, CheckCircle, Archive, FileSpreadsheet } from "lucide-react"
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { memosService } from '@/services/memos.service';
import { cn } from "@/lib/utils"
import { forumsService } from '@/services/forums.service';
import { STATUS_STYLES, STATUS_TEXT } from '@/constants/status';

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

// Create a separate component for the actions cell
const ActionCell = ({ row, navigate, toast, setRefresh }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { id, status: currentStatus, files, forum } = row.original;

  const canChangeStatus = user.role === 'ADMIN' ||
    (user.office_id === '110' && user.role === 'USER') ||
    user.role === 'USER';

  const hasForumAccess = forum?.canAccess;
  const showForumActions = forum && hasForumAccess;

  const handleForumStatusChange = async () => {
    if (!forum || !user.role === 'ADMIN') return;

    try {
      setIsLoading(true);
      const newStatus = forum.status === 'OPEN' ? 'CLOSED' : 'OPEN';
      await forumsService.updateForumStatus(forum.id, newStatus);

      toast.success(`Foro ${newStatus === 'OPEN' ? 'abierto' : 'cerrado'} exitosamente`);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error changing forum status:', error);
      toast.error('Error al cambiar el estado del foro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!canChangeStatus) {
      toast.error('No tienes permisos para cambiar el estado del oficio');
      return;
    }

    try {
      setIsLoading(true);
      await memosService.updateMemoStatus(id, newStatus, user);
      toast.success('Estado actualizado correctamente');
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error.response?.data?.error || 'Error al actualizar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Keep only one Ver Detalles action */}
        <DropdownMenuItem onClick={() => navigate(`/memos/${id}/details`)} className="hover:bg-blue-50">
          <div className="flex items-center gap-2 text-blue-600">
            <Eye className="h-4 w-4" />
            <span>Ver Detalles</span>
          </div>
        </DropdownMenuItem>

        {/* Add Excel action */}
        <DropdownMenuItem onClick={() => navigate(`/memos/${id}/excel`)} className="hover:bg-green-50">
          <div className="flex items-center gap-2 text-green-600">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Generar Excel</span>
          </div>
        </DropdownMenuItem>

        {/* Forum Actions */}
        {showForumActions ? (
          <DropdownMenuItem
            onClick={() => navigate(`/forums/${forum.id}`)}
            className="hover:bg-emerald-50"
          >
            <div className="flex items-center gap-2 text-emerald-600">
              <MessageCircle className="h-4 w-4" />
              <span>Ver Foro</span>
            </div>
          </DropdownMenuItem>
        ) : !forum && (
          <DropdownMenuItem
            onClick={() => navigate(`/check-forum/${id}`)}
            className="hover:bg-emerald-50"
          >
            <div className="flex items-center gap-2 text-emerald-600">
              <MessageCircle className="h-4 w-4" />
              <span>Abrir Foro</span>
            </div>
          </DropdownMenuItem>
        )}

        {/* Status Change Actions */}
        {canChangeStatus && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Cambiar Estado</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                disabled={currentStatus === "PENDING"}
                onClick={() => handleStatusChange('PENDING')}
              >
                <Circle className="mr-2 h-4 w-4 text-yellow-500" />
                Pendiente
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={currentStatus === "COMPLETED"}
                onClick={() => handleStatusChange('COMPLETED')}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Completado
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={currentStatus === "ARCHIVED"}
                onClick={() => handleStatusChange('ARCHIVED')}
              >
                <Archive className="mr-2 h-4 w-4 text-gray-500" />
                Archivado
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {/* View Files Action */}
        {files && files.length > 0 && (
          <DropdownMenuItem onClick={() => handleViewFile(files[0])} className="hover:bg-purple-50">
            <div className="flex items-center gap-2 text-purple-600">
              {files[0].type === 'application/pdf' ? (
                <FileText className="h-4 w-4" />
              ) : (
                <FileImage className="h-4 w-4" />
              )}
              <span>Ver Archivo</span>
            </div>
          </DropdownMenuItem>
        )}

        {/* Forum Status Action */}
        {user.role === 'ADMIN' && forum && (
          <DropdownMenuItem
            onClick={handleForumStatusChange}
            disabled={isLoading}
            className={cn(
              "hover:bg-opacity-10",
              forum.status === 'OPEN' ? "hover:bg-red-50" : "hover:bg-emerald-50"
            )}
          >
            <div className={cn(
              "flex items-center gap-2",
              forum.status === 'OPEN' ? "text-red-600" : "text-emerald-600"
            )}>
              {forum.status === 'OPEN' ? (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Cerrar Foro</span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Abrir Foro</span>
                </>
              )}
            </div>
          </DropdownMenuItem>
        )}

        {/* Assign Instruction Action */}
        {(user.role === 'ADMIN' || user.office_id === '101') && (
          <DropdownMenuItem onClick={() => navigate(`/memos/${id}/assign-instruction`)} className="hover:bg-amber-50">
            <div className="flex items-center gap-2 text-amber-600">
              <FileText className="h-4 w-4" />
              <span>Asignar Instrucción</span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Define columns with the new ActionCell component
export const columns = ({ navigate, toast, setRefresh }) => [
  {
    accessorKey: "instruction_status",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            className="bg-transparent hover:bg-green-700/80"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Instrucción
            <SortedIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.original.instruction_status;
      const instruction = row.original.instruction;

      return (
        <div className="flex flex-col items-center gap-0.5 py-1">
          <Badge
            variant={status === 'PENDING' ? 'pending' : 'completed'}
            className="w-fit text-xs"
          >
            {STATUS_TEXT[status]}
          </Badge>
          {status === 'ASSIGNED' && instruction && (
            <span className="text-xs text-gray-600 font-medium truncate max-w-[180px] text-center">
              {instruction}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          className="bg-transparent hover:bg-green-700/80"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Correspondencia
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
            Oficinas
            <SortedIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const offices = row.original.offices;
      return (
        <div className="flex flex-wrap gap-1 justify-center">
          {offices.map((officeRel) => (
            <Badge
              key={officeRel.office.id}
              variant="secondary"
              className="text-xs"
            >
              {officeRel.office.name}
            </Badge>
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
      const date = row.original.reception_date;

      const formatDate = (dateString) => {
        // Parse the date and adjust for timezone
        const date = new Date(dateString);
        // Add the timezone offset to get the correct date
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'UTC' // Force UTC to prevent timezone conversion
        };

        return date.toLocaleDateString('es-ES', options);
      };

      return <div className="font-medium">{formatDate(date)}</div>;
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
      const forum = row.original.forum;

      return (
        <div className="text-center space-y-1">
          <Badge
            variant="outline"
            className={`${STATUS_STYLES[status]} border`}
          >
            {STATUS_TEXT[status]}
          </Badge>

          {/* Forum Status Badge */}
          {forum ? (
            <Badge
              variant={forum.status === "OPEN" ? "success" : "destructive"}
              className={cn(
                "text-xs",
                forum.status === "OPEN"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-red-100 text-red-800 border-red-200"
              )}
            >
              Foro {forum.status === "OPEN" ? "Abierto" : "Cerrado"}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-600 border-gray-200"
            >
              Sin Foro
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

      if (!images || images.length === 0) {
        return (
          <div className="text-center text-gray-500 text-sm">
            Sin imágenes
          </div>
        );
      }

      const handleViewImage = (image) => {
        console.log(image)
        if (image.isPdf) {
          window.open(`${image.path}`, '_blank');
          return;
        }
        const imageUrl = `${image.path}`;
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
    accessorKey: "attachment_files",
    header: () => {
      return <div className="text-center">Adjuntos</div>
    },
    cell: ({ row }) => {
      const files = row.original.attachment_files;

      if (!files || files.length === 0) {
        return (
          <div className="text-center text-gray-500 text-sm">
            Sin adjuntos
          </div>
        );
      }

      const handleViewFile = (file) => {
        // Format the path to ensure proper URL structure
        const formattedPath = file.path.replace(/\\/g, '/');
        // Add forward slash between base URL and path if needed
        const fileUrl = `${formattedPath.startsWith('/') ? formattedPath.slice(1) : formattedPath}`;

        if (file.type === 'application/pdf') {
          window.open(fileUrl, '_blank');
          return;
        }
        window.open(fileUrl, '_blank', 'width=800,height=600');
      };

      return (
        <div className="flex justify-center gap-2">
          {files && files.map((file, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={() => handleViewFile(file)}
              className="hover:bg-blue-700/20"
              title={file.filename}
            >
              {file.type === 'application/pdf' ? (
                <FileText className="h-5 w-5 text-blue-500" />
              ) : (
                <Eye className="h-5 w-5 text-blue-600" />
              )}
            </Button>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} navigate={navigate} toast={toast} setRefresh={setRefresh} />
  },
]