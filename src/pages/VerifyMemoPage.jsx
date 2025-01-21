import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { sentMemosService } from '../services/sentMemos.service';
import { Button } from "../components/ui/button";
import { Download } from "lucide-react";

export const VerifyMemoPage = () => {
  const { id } = useParams();
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const data = await sentMemosService.getSentMemo(id);
        setMemo(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemo();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Verificación de Documento
          </h1>
          <p className="mt-2 text-gray-600">
            ID: {memo.id}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {memo.title}
            </h2>
            <p className="mt-1 text-gray-600">
              Fecha de registro: {format(new Date(memo.registerDate), "PPP", { locale: es })}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Documento Original
            </h3>
            <div className="mt-2">
              <iframe
                src={`http://172.16.2.51:3005/${memo.pdfWithQR}`}
                className="w-full h-[600px] border rounded-lg shadow"
                title="Documento con QR"
              />

              <div className="mt-4 flex justify-center">
                <a
                  href={`http://172.16.2.51:3005/${memo.pdfWithQR}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Documento
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 text-center">
              Este documento fue registrado digitalmente en el sistema de seguimiento de correspondencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 