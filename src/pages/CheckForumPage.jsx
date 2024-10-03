import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const CheckForumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const checkForumExistence = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/forums/check-existence/${id}`)

        if (response.data.exists) {
          navigate(`/forums/${response.data.id}`);
        } else {
          navigate(`/create-forum/${id}`);
        }
      } catch (error) {
        console.error('Failed to check forum existence:', error);
      }
    };

    checkForumExistence();
  }, []);

  return <p>Checking forum existence...</p>;
};

