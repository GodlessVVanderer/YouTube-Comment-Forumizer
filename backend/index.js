import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock YouTube data
const mockComments = [
  { id: '1', text: 'Great video!', author: 'user1', spam: false },
  { id: '2', text: 'BUY NOW CRYPTO SCAM!!!', author: 'spam_bot', spam: true },
  { id: '3', text: 'Very informative content', author: 'user2', spam: false },
  { id: '4', text: 'CHECK THIS LINK xxxxx', author: 'spam_bot2', spam: true },
];

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'YouTube Comment Forumizer API running' });
});

// Get comments for video
app.get('/api/comments/:videoId', (req, res) => {
  res.json({ 
    videoId: req.params.videoId,
    comments: mockComments,
    total: mockComments.length
  });
});

// Analyze comments
app.post('/api/analyze', async (req, res) => {
  const { videoId, title, description } = req.body;
  
  try {
    const analyzed = mockComments.map(comment => ({
      ...comment,
      spam: comment.spam,
      category: comment.spam ? 'SPAM' : 'CIVIL_DISCUSSION',
      confidence: Math.random() * 100
    }));

    res.json({ 
      status: 'success',
      videoId,
      title,
      analyzed,
      spamCount: analyzed.filter(c => c.spam).length,
      totalCount: analyzed.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get spam report
app.get('/api/report/:videoId', (req, res) => {
  const spamCount = mockComments.filter(c => c.spam).length;
  res.json({
    videoId: req.params.videoId,
    totalComments: mockComments.length,
    spamComments: spamCount,
    spamPercentage: ((spamCount / mockComments.length) * 100).toFixed(2),
    categories: {
      spam: spamCount,
      civilDiscussion: mockComments.length - spamCount
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
