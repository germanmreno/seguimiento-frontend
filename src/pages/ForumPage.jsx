import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import { Layout } from "../layout/Layout"
import axios from "axios";
import { Loader } from "@/components/custom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
              <p className="mb-4">{forum.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  replies
                </span>
                <span className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  views
                </span>
                <span className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  likes
                </span>
              </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>

      </div>
    </Layout >
  )
}