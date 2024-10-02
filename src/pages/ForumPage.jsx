import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import { Layout } from "../layout/Layout"

export const ForumPage = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Layout >

      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <h1>{id}</h1>
      </div>
    </Layout>
  )
}