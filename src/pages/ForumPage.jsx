import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import { Layout } from "../layout/Layout"
import axios from "axios";
import { Loader } from "@/components/custom";

export const ForumPage = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [forum, setForum] = useState(null);
  const [relatedOffices, setRelatedOffices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForumDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/forums/${id}`);
        console.log(response)
        setForum(response.data);
        setRelatedOffices(response.data.relatedOffices);
      } catch (error) {
        console.error('Failed to fetch forum details:', error);
        setError('Failed to fetch forum details.');
      }
    };

    fetchForumDetails();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!forum) {
    return (<Layout>
      <Loader />
    </Layout>)

  }

  return (
    <Layout >

      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">

        <h2>Forum Details</h2>
        <p><strong>Title:</strong> {forum.title}</p>
        <p><strong>Description:</strong> {forum.description}</p>
        <p><strong>Memo ID:</strong> {forum.memo_id.toUpperCase()}</p>
        <h3>Related Offices</h3>
        {relatedOffices.length > 0 ? (
          <ul>
            {relatedOffices.map((office) => (
              <li key={office.id}>
                <p><strong>Name:</strong> {office.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No related offices found.</p>
        )}

      </div>
    </Layout >
  )
}