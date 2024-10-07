import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'; // Adjust the imports as needed/ Adjust the imports as needed
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Layout } from '@/layout';

export const CheckForumPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [forumExists, setForumExists] = useState(null);

  useEffect(() => {
    const checkForumExistence = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/forums/check-existence/${id}`);

        if (response.data.exists) {
          navigate(`/forums/${response.data.id}`);
        } else {
          setForumExists(false);
        }
      } catch (error) {
        console.error('Failed to check forum existence:', error);
      }
    };

    checkForumExistence();
  }, [id, navigate]);

  if (forumExists === null) {
    return <p>Checking forum existence...</p>;
  }

  return (
    <Layout>
      <div>
        {!forumExists && (
          <Dialog open={!forumExists} onOpenChange={(isOpen) => { if (!isOpen) navigate(-1); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-2 primary-text">Foro sin crear</DialogTitle>
                <DialogDescription>
                  El oficio <strong>{id.toUpperCase()}</strong> no posee un foro registrado. ¿Desea crear uno?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => navigate(`/create-forum/${id}`)}>Crear foro</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};


