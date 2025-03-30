import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { FileText } from "lucide-react"
import { puntosCuentaService } from "@/services/puntosCuenta.service"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const columns = ({ offices }) => [
  {
    accessorKey: "numero",
    header: "Número",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("numero")}</div>
    ),
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => format(new Date(row.getValue("fecha")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "presentante",
    header: "Presentante",
    cell: ({ row }) => {
      const presentantes = row.getValue("presentante") || [];

      if (!Array.isArray(presentantes) || presentantes.length === 0) {
        return <div className="text-gray-500">-</div>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {presentantes.map((officeId, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-50"
            >
              {offices[officeId] || `Oficina ${officeId}`}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "asunto",
    header: "Asunto",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("asunto")}>
        {row.getValue("asunto")}
      </div>
    ),
  },
  {
    accessorKey: "decision",
    header: "Decisión",
    cell: ({ row }) => {
      const decision = row.getValue("decision")
      const variants = {
        PENDIENTE: "bg-yellow-50 text-yellow-700 border-yellow-200",
        APROBADO: "bg-green-50 text-green-700 border-green-200",
        RECHAZADO: "bg-red-50 text-red-700 border-red-200",
      }

      return (
        <Badge
          variant="secondary"
          className={variants[decision] || "bg-gray-50 text-gray-700 border-gray-200"}
        >
          {decision || 'N/A'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "documento_escaneado",
    header: "Documento",
    cell: ({ row }) => {
      const docPath = row.getValue("documento_escaneado");
      return docPath ? (
        <a
          href={docPath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Ver documento
        </a>
      ) : (
        <span className="text-gray-500">-</span>
      );
    },
  },
  {
    accessorKey: "observacion",
    header: "Observación",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("observacion")}>
        {row.getValue("observacion") || '-'}
      </div>
    ),
  },
] 