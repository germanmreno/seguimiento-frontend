import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { columns } from "../puntosCuenta/columns"
import { DataTable } from "../puntosCuenta/data-table"
import { Layout } from "../layout/Layout"
import { Loader } from "@/components/custom"
import { puntosCuentaService } from "@/services/puntosCuenta.service"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const PuntosCuentaPage = () => {
  const navigate = useNavigate()
  const [puntos, setPuntos] = useState([])
  const [offices, setOffices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtering, setFiltering] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)
      const officesData = await puntosCuentaService.getOffices()
      const officesMap = officesData.reduce((acc, office) => {
        acc[office.id] = office.name
        return acc
      }, {})
      setOffices(officesMap)

      const puntosData = await puntosCuentaService.getAllPuntos()
      setPuntos(puntosData)
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
    fetchData()
  }, [])

  if (loading) return (
    <Layout>
      <Loader />
    </Layout>
  )

  return (
    <Layout>
      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full h-12 flex items-center justify-start p-0 border-solid border-gray border-2 pl-4" >
          <h1 className="primary-text p-0 m-0">PUNTOS DE CUENTA</h1>
        </div>
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-500">Error al cargar los puntos de cuenta</p>
            <button
              onClick={fetchData}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="bg-white">
            <div className="flex justify-between items-center p-4 bg-gray-100">
              <input
                type="text"
                placeholder="Buscar..."
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                className="max-w-sm px-4 py-2 rounded border"
              />
              <Button
                onClick={() => navigate('/register-punto-cuenta')}
                className="bg-[#006f2d] hover:bg-[#005c26] text-white primary-text"
              >
                <Plus className="mr-2 h-4 w-4" /> Nuevo Punto de Cuenta
              </Button>
            </div>
            <DataTable
              columns={columns({ offices })}
              data={puntos}
              filtering={filtering}
            />
          </div>
        )}
      </div>
    </Layout>
  )
} 