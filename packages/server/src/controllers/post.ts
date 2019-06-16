import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import isEmpty from '../utilities/isEmpty';
import passErrorToNext from '../utilities/passErrorToNext';
import deleteFile from '../utilities/deleteFile';
import isAuthorized from '../utilities/isAuthorized';
import {
  createPost,
  editPost,
  getPostContent,
  getPostById,
} from '../services/postServices';
export const postPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { communityId } = req.params;
    const { type } = req.query;
    console.log(type, req.query);
    const { userId } = req;
    const { title } = req.body;
    const content = getPostContent(type, req);
    const postId = await createPost(type, title, content, communityId, userId);
    const port = process.env.PORT || 8080;
    res.status(200).json({
      data: { postId },
      links: { self: `http://localhost:${port}/posts/${postId}` },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const patchPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    isEmpty(validationResult(req));
    const { postId } = req.params;
    const { userId } = req;
    const { title } = req.body;
    const post = await getPostById(postId);
    const oldImageUrl = post.image ? postId.image : '';
    const content = getPostContent(post.type, req);
    await editPost(post, userId, title, content);
    if (post.type === 'image') {
      deleteFile(oldImageUrl);
    }
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const post = await getPostById(postId);
    isAuthorized(post.user, userId);
    post.remove();
    await post.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};