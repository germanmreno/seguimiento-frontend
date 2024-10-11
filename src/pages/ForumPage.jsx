import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../layout/Layout"
import axios from "axios";
import { Loader } from "@/components/custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatBox } from "@/components/custom";
import { urgencyOptions } from "@/options/formOptions";

export const ForumPage = () => {

  const { id } = useParams();

  const [forum, setForum] = useState(null);
  const [relatedOffices, setRelatedOffices] = useState([]);
  const [error, setError] = useState('');

  const urgencyVariant = urgencyOptions.find(option => option.id === forum?.memoDetails?.urgencyLevel?.toUpperCase())?.variant;

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

        <div className="flex justify-center">
          <Card className="w-[1200px]">
            <CardHeader className="bg-primary-blue mb-4 text-white flex w-full justify-center">
              <CardTitle><span className="primary-text text-xl mr-2">{forum.title}</span> <Badge className="text-xs" variant="officeBadge">{(forum.memo_id).toUpperCase()}</Badge></CardTitle>
              <CardDescription>
                {relatedOffices.length > 0 && (
                  <ul className="flex space-x-2">
                    {relatedOffices.map((office) => (
                      <li key={forum.id}>
                        <Badge className="bg-primary-green">
                          <p>{office.name}</p>
                        </Badge>
                      </li>

                    ))}
                  </ul>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-justify">{forum.description}</span>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 ">
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  <span>NIVEL DE URGENCIA:</span>
                  <Badge className="ml-2" variant={urgencyVariant}>
                    {forum.memoDetails.urgencyLevel}
                  </Badge>
                </div>
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Creado el {new Date(forum.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center border-t-2 border-primary-blue rounded-b-lg bg-primary-blue text-white rounded-lg border-none  ">
          <h2 className="text-2xl font-bold py-4 primary-text">Chat del foro</h2>
          <ChatBox forumId={id} />
        </div>


      </div>
    </Layout >
  )
}