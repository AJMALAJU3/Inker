import { IBlogModel } from "@/models/implementation/blog.model";
import { Types } from "mongoose";

export interface IBlogRepository {
  createBlog(blogData: Partial<IBlogModel>): Promise<IBlogModel>;
  findBlogById(blogId: Types.ObjectId): Promise<IBlogModel | null>;
  findBlogByAuthorId(authorId: Types.ObjectId): Promise<IBlogModel[] | null>;
  findAllBlogs(): Promise<IBlogModel[]>;
  updateBlog(
    blogId: Types.ObjectId,
    authorId: Types.ObjectId,
    updateData: Partial<IBlogModel>
  ): Promise<IBlogModel | null>;
  deleteBlog(blogId: Types.ObjectId, authorId: Types.ObjectId): Promise<IBlogModel | null>;
}
