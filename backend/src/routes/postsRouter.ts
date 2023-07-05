// postsRouter.ts
import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
export const postsRouter = Router();

postsRouter.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const posts = await fetchPosts(userId);

    if (posts.length === 0) {
      const externalPosts = await fetchExternalPosts(userId);

      const createdPosts = await createPosts(userId, externalPosts);

      res.json(createdPosts);
    } else {
      res.json(posts);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

async function fetchPosts(userId: string) {
  return prisma.post.findMany({
    where: { userId: Number(userId) },
  });
}

async function fetchExternalPosts(userId: string) {
  const response = await axios.get(`${process.env.API_URL}/posts?userId=${userId}`);
  return response.data;
}

async function createPosts(userId: string, externalPosts: any[]) {
  return prisma.post.createMany({
    data: externalPosts.map((post: any) => ({
      userId: Number(userId),
      title: post.title,
      body: post.body,
    })),
    skipDuplicates: true,
  });
}
