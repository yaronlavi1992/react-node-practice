// import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { app, port } from './app';
import { usersRouter } from './routes/usersRouter';
import { postsRouter } from './routes/postsRouter';

dotenv.config({ path: '.env' });

app.use(cors());

// app.get('/api/data', (req: Request, res: Response) => {
//   // Handle the API request and send a response
//   console.log(process.env.API_URL);

//   const apiUrl = process.env.API_URL;
//   res.json({ message: `Hello from the API! The API URL is ${apiUrl}` });
// });

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});