import axios from 'axios';

const fetchMemos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/memos');
    console.log('Raw server response:', response.data);

    const mappedData = response.data.map((memo) => {
      console.log('Processing memo:', memo);
      console.log('Forums array:', memo.forums);

      const result = {
        ...memo,
        forum:
          Array.isArray(memo.forums) && memo.forums.length > 0
            ? {
                ...memo.forums[0],
                status: memo.forums[0].status || 'OPEN',
              }
            : null,
        forums: undefined,
      };

      console.log('Processed result:', result);
      return result;
    });

    return mappedData;
  } catch (error) {
    console.error('Error fetching memos:', error);
    throw error;
  }
};

export default fetchMemos;
