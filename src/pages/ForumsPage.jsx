import { useEffect, useState } from "react";
import { Layout } from "../layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, MessageCircle, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/custom";

export const ForumsPage = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllForums = async () => {
      try {
        const memosResponse = await axios.get('http://localhost:3000/memos');
        const memos = memosResponse.data;

        const forumsPromises = memos.map(async (memo) => {
          try {
            const forumResponse = await axios.get(`http://localhost:3000/forums/check-existence/${memo.id}`);
            if (forumResponse.data.exists) {
              // Include messages in the forum fetch
              const fullForumResponse = await axios.get(`http://localhost:3000/forums/${forumResponse.data.id}`);
              const forumData = fullForumResponse.data;

              // Get messages count for this forum
              const messagesResponse = await axios.get(`http://localhost:3000/forums/${forumResponse.data.id}/messages`);

              return {
                ...forumData,
                messageCount: messagesResponse.data.length
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching forum for memo ${memo.id}:`, error);
            return null;
          }
        });

        const forumsResults = await Promise.all(forumsPromises);
        const validForums = forumsResults.filter(forum => forum !== null);
        setForums(validForums);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forums:', error);
        setLoading(false);
      }
    };

    fetchAllForums();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-primary-blue mb-6">Foros Activos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forums.map((forum) => (
            <Card
              key={forum.id}
              className={cn(
                "cursor-pointer hover:shadow-lg transition-shadow duration-200",
                "border-2",
                forum.status === 'CLOSED' ? "border-red-500/50" : "border-primary-blue/50"
              )}
              onClick={() => navigate(`/forums/${forum.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-primary-blue">
                    {forum.title}
                  </CardTitle>
                  {forum.status === 'CLOSED' && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Cerrado
                    </Badge>
                  )}
                </div>
                <CardDescription className="space-y-2">
                  <div>
                    Memo: <Badge variant="outline">{forum.memo_id.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-wrap gap-1">
                      {forum.relatedOffices.map((office, index) => (
                        <Badge
                          key={office.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {office.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {forum.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{forum.messageCount} mensajes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(forum.createdAt).toLocaleDateString()}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};