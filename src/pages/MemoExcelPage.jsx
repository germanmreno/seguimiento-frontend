import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { memosService } from "@/services/memos.service";
import { generateMemoExcel } from "@/utils/excelGenerator";

export const MemoExcelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const data = await memosService.getMemo(id);
        setMemo(data);
      } catch (error) {
        console.error("Error al cargar el memo", error);
        toast.error("Error al cargar el memo");
        navigate("/memos");
      } finally {
        setLoading(false);
      }
    };

    fetchMemo();
  }, [id, navigate]);

  const handleDownload = async () => {
    try {
      await generateMemoExcel(memo);
      toast.success("Remisión generada exitosamente");
    } catch (error) {
      console.error("Error al generar la remisión", error);
      toast.error("Error al generar la remisión");
    }
  };

  if (loading) {
    return <Layout>Cargando...</Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          onClick={() => navigate("/memos")}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>

        <Card className="overflow-hidden">
          {/* Blue header */}
          <div className="bg-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">
              Generar Remisión
            </h2>
            <p className="text-blue-100 mt-2">
              Memo N° {memo?.id}
            </p>
          </div>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Memo details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Detalles del Memo
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Asunto:</span>
                    <p className="font-medium">{memo?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Presentante:</span>
                    <p className="font-medium">{memo?.applicant}</p>
                  </div>
                </div>
              </div>

              {/* Download section */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <p className="text-gray-600 text-center max-w-md">
                  Al generar la remisión, se creará un documento Excel con todos los detalles del memo.
                </p>
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  <FileSpreadsheet className="mr-2 h-5 w-5" />
                  Generar Remisión
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}; 