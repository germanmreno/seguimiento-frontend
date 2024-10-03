import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { columns } from "../forums/columns"
import { DataTable } from "../forums/data-table"

import { Layout } from "../layout/Layout"

import fetchMemos from "@/helpers/fetchMemos";
import { Loader } from "@/components/custom";

export const MemoTablePage = () => {

  const navigate = useNavigate();

  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMemos = async () => {
      try {
        const memosData = await fetchMemos();
        setMemos(memosData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getMemos();
  }, []);

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
        <DataTable columns={columns(navigate)} data={memos} />
      </div>
    </Layout>
  )
}