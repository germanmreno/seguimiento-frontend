import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { columns } from "../puntosCuenta/columns"
import { DataTable } from "../puntosCuenta/data-table"
import { Layout } from "../layout/Layout"
import { Loader } from "@/components/custom"
import { puntosCuentaService } from "@/services/puntosCuenta.service"
import { toast } from "sonner"

export const PuntosCuentaPage = () => {
  const navigate = useNavigate()
  const [puntos, setPuntos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPuntos = async () => {
    try {
      const data = await puntosCuentaService.getAllPuntos()
      setPuntos(data)
      setError(null)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPuntos()
  }, [])

  if (loading) return (
    <Layout>
      <Loader />
    </Layout>
  )

  return (
    <Layout>
      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full h-12 flex items-center justify-start p-0 border-solid border-gray border-2 pl-4">
          <h1 className="primary-text p-0 m-0">PUNTOS DE CUENTA</h1>
        </div>
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-500">Error al cargar los puntos de cuenta</p>
            <button
              onClick={fetchPuntos}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns({ navigate })}
            data={puntos}
          />
        )}
      </div>
    </Layout>
  )
} 