import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { FileText } from "lucide-react"

export const columns = ({ navigate }) => [
  {
    accessorKey: "numero",
    header: "Número",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("numero")}</div>
    ),
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tipo")}</div>
    ),
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => formatDate(row.getValue("fecha")),
  },
  {
    accessorKey: "presentante",
    header: "Presentante",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue("presentante")}
      </div>
    ),
  },
  {
    accessorKey: "asunto",
    header: "Asunto",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.getValue("asunto")}
      </div>
    ),
  },
  {
    accessorKey: "decision",
    header: "Decisión",
    cell: ({ row }) => {
      const decision = row.getValue("decision")
      return (
        <div className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${decision === 'APROBADO' ? 'bg-green-100 text-green-800' : ''}
          ${decision === 'EN REVISIÓN' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${decision === 'DIFERIDO' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {decision}
        </div>
      )
    },
  },
  {
    accessorKey: "documento_escaneado",
    header: "Documento",
    cell: ({ row }) => {
      const documentUrl = row.getValue("documento_escaneado")
      return documentUrl ? (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="flex items-center text-blue-500 hover:text-blue-700"
            onClick={() => window.open(documentUrl, '_blank')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver documento
          </Button>
        </div>
      ) : (
        <div className="text-center text-gray-500">Sin documento</div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="link"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => navigate(`/puntos-cuenta/${row.original.id}`)}
          >
            Ver detalles
          </Button>
        </div>
      )
    },
  },
] 