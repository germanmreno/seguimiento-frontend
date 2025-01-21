import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { FileText } from "lucide-react"

export const columns = ({ navigate }) => [
  {
    accessorKey: "numero",
    header: "Nro. Oficio",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("numero")}
      </div>
    ),
  },
  {
    accessorKey: "elaboradoPor",
    header: "Elaborado Por",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("elaboradoPor")}
      </div>
    ),
  },
  {
    accessorKey: "institucion",
    header: "Institución",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("institucion")}
      </div>
    ),
  },
  {
    accessorKey: "destinatario",
    header: "Destinatario",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("destinatario")}
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
    accessorKey: "fechaElaboracion",
    header: "Fecha Elaboración",
    cell: ({ row }) => formatDate(row.getValue("fechaElaboracion")),
  },
  {
    accessorKey: "fechaEntrega",
    header: "Fecha Entrega",
    cell: ({ row }) => formatDate(row.getValue("fechaEntrega")),
  },
  {
    accessorKey: "requiereRespuesta",
    header: "Requiere Respuesta",
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("requiereRespuesta") ? "Sí" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <div className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${status === 'FINALIZADO' ? 'bg-green-100 text-green-800' : ''}
          ${status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : ''}
        `}>
          {status}
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
            onClick={() => navigate(`/oficios-presidencia/${row.original.id}`)}
          >
            Ver detalles
          </Button>
        </div>
      )
    },
  },
] 