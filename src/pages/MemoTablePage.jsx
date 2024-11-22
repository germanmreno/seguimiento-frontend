import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { columns } from "../forums/columns"
import { DataTable } from "../forums/data-table"

import { Layout } from "../layout/Layout"

import { Loader } from "@/components/custom";
import { toast } from 'sonner';
import { memosService } from "@/services/memos.service";
import { useAuth } from "@/contexts/AuthContext";

export const MemoTablePage = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false); // State variable to trigger refresh

  useEffect(() => {
    const getMemos = async () => {
      try {
        setLoading(true);
        const memosData = await memosService.getAllMemosWithFilters(user);

        // Transform data to match the current structure
        const transformedMemos = memosData.map(memo => ({
          ...memo,
          // Ensure these fields exist with default values if needed
          status: memo.status || 'PENDING',
          instruction_status: memo.instruction_status || 'PENDING',
          forum: memo.forum || null,
          // Format dates if needed
          reception_date: memo.reception_date ? new Date(memo.reception_date).toISOString() : null,
          reception_hour: memo.reception_hour || null,
          // Ensure offices array exists
          offices: memo.offices || [],
        }));

        setMemos(transformedMemos);
        setError(null);
      } catch (err) {
        console.error('Error fetching memos:', err);
        setError(err.message || 'Error al cargar los oficios');
        toast.error('Error al cargar los oficios');
      } finally {
        setLoading(false);
      }
    };

    getMemos();
  }, [refresh, user]);

  if (loading) return (<Layout>
    <Loader />
  </Layout>)
  if (error) return <p>Error: {error.message}</p>;


  return (
    <Layout >

      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full h-12 flex items-center justify-start p-0 border-solid border-gray border-2 pl-4" >
          <h1 className="primary-text p-0 m-0">LISTA DE OFICIOS DE LA CORPORACIÓN VENEZOLANA DE MINERÍA</h1>
        </div>
        <DataTable columns={columns({ navigate, toast, setRefresh })} data={memos} />
      </div>
    </Layout>
  )
}