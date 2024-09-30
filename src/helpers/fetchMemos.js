import axios from 'axios';

const fetchMemos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/memos');
    return response.data;
  } catch (error) {
    console.error('Error fetching memos:', error);
    throw error;
  }
};

export default fetchMemos;
