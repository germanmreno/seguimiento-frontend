import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { columns } from "../oficiosPresidencia/columns"
import { DataTable } from "../oficiosPresidencia/data-table"
import { Layout } from "../layout/Layout"
import { Loader } from "@/components/custom"
import { oficiosPresidenciaService } from "@/services/oficiosPresidencia.service"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export const OficiosPresidenciaPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [oficios, setOficios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const getOficios = async () => {
      try {
        setLoading(true)
        const oficiosData = await oficiosPresidenciaService.getAllOficios()

        // Transform data to match the structure
        const transformedOficios = oficiosData.map(oficio => ({
          ...oficio,
          status: oficio.status || 'PENDIENTE',
          // Format dates
          fechaElaboracion: oficio.fechaElaboracion ? new Date(oficio.fechaElaboracion).toISOString() : null,
          fechaEntrega: oficio.fechaEntrega ? new Date(oficio.fechaEntrega).toISOString() : null,
          // Ensure elaboradoPor is parsed if it's a string
          elaboradoPor: typeof oficio.elaboradoPor === 'string'
            ? JSON.parse(oficio.elaboradoPor)
            : oficio.elaboradoPor || [],
        }))

        setOficios(transformedOficios)
        setError(null)
      } catch (err) {
        console.error('Error fetching oficios:', err)
        setError(err.message || 'Error al cargar los oficios')
        toast.error('Error al cargar los oficios')
      } finally {
        setLoading(false)
      }
    }

    getOficios()
  }, [refresh, user])

  if (loading) return (
    <Layout>
      <Loader />
    </Layout>
  )

  if (error) return (
    <Layout>
      <div className="container mx-auto py-10">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => setRefresh(prev => !prev)}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          Reintentar
        </button>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full h-12 flex items-center justify-start p-0 border-solid border-gray border-2 pl-4">
          <h1 className="primary-text p-0 m-0">OFICIOS DE PRESIDENCIA</h1>
        </div>
        <DataTable
          columns={columns({ navigate, toast, setRefresh })}
          data={oficios}
        />
      </div>
    </Layout>
  )
} 