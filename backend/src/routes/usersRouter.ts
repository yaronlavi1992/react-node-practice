import axios from 'axios';
import { Request, Response, Router } from 'express';
import { User } from '../types/tpyes';

export const usersRouter = Router();

const userCache: { [key: string]: User[] } = {};

usersRouter.get('/:page', async (req: Request, res: Response) => {
  try {
    const page = Number(req.params.page) || 1;
    const limit = 4;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (userCache[page]) {
      // Return cached users if available
      const cachedUsers = userCache[page];
      const totalPages = Math.ceil(cachedUsers.length / limit);
      const paginatedUsers = cachedUsers.slice(startIndex, endIndex);

      res.json({
        data: paginatedUsers,
        page,
        totalPages,
      });
    } else {
      // Fetch users from external API
      const response = await axios.get(`${process.env.API_URL}/users`);
      const users: User[] = response.data;

      // Cache the fetched users
      userCache[page] = users;

      const totalPages = Math.ceil(users.length / limit);
      const paginatedUsers = users.slice(startIndex, endIndex);

      res.json({
        data: paginatedUsers,
        page,
        totalPages,
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
