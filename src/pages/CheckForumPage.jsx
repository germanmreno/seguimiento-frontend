import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Layout } from '@/layout';
import { forumsService } from '@/services/forums.service';
import { Loader } from '@/components/custom/Loader';

export const CheckForumPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [forumExists, setForumExists] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkForumExistence = async () => {
      try {
        setIsLoading(true);
        const response = await forumsService.checkForumExistence(id);

        if (response.exists) {
          navigate(`/forums/${response.id}`);
        } else {
          setForumExists(false);
        }
      } catch (error) {
        console.error('Failed to check forum existence:', error);
        setForumExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkForumExistence();
  }, [id, navigate]);

  if (isLoading) {
    return <Loader message={`Verificando existencia del foro para el oficio ${id.toUpperCase()}...`} />;
  }

  return (
    <Layout>
      <div>
        {!forumExists && (
          <Dialog
            open={!forumExists}
            onOpenChange={(isOpen) => { if (!isOpen) navigate(-1); }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-2 primary-text">Foro sin crear</DialogTitle>
                <DialogDescription>
                  El oficio <strong>{id.toUpperCase()}</strong> no posee un foro registrado. ¿Desea crear uno?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => navigate(`/create-forum/${id}`)}>
                  Crear foro
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};


