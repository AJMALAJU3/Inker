import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { ViewMode, TabMode, BlogEditorState, Blog } from '@/types/index';
import { blogService } from "@/services/blogServices";

const initialState: BlogEditorState = {
  title: "",
  content: "",
  activeTab: "write",
  saved: false,
  thumbnail: null,
  attachments: [],
  attachmentUrls: [],
  blogs: [],
  viewMode: "editor",
  loading: false,
  error: null,
  editingBlogId: null,
  tags: [],
};

interface SaveBlogPayload {
  title: string;
  content: string;
  thumbnail: File | null;
  attachments: File[];
  tags: string[];
  editingBlogId: string | null;
}

// Thunks
export const saveBlog = createAsyncThunk(
  "blogEditor/saveBlog",
  async ({ title, content, thumbnail, attachments, tags, editingBlogId }: SaveBlogPayload, { rejectWithValue }) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      if (thumbnail) formData.append("thumbnail", thumbnail);
      attachments.forEach((file, index) => {
        formData.append(`attachment${index}`, file);
      });

      // Add other data
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));


      if (editingBlogId) {
        await blogService.editBlogService(formData);
      } else {
        await blogService.createBlogService(formData);
      }

      return { 
        title, 
        content,
        thumbnailData: thumbnail ? {
          url: URL.createObjectURL(thumbnail),
          name: thumbnail.name
        } : null,
        attachmentData: attachments.map(file => ({
          url: URL.createObjectURL(file),
          name: file.name
        })),
        tags,
        editingBlogId 
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const blogSlice = createSlice({
  name: "blogEditor",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.saved = false;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
      state.saved = false;
    },
    setActiveTab: (state, action: PayloadAction<TabMode>) => {
      state.activeTab = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.push(action.payload);
      state.saved = true;
      state.viewMode = "blogs";
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
        state.saved = true;
        state.viewMode = "blogs";
      }
    },
    editBlog: (state, action: PayloadAction<Blog>) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.thumbnail = null;
      state.attachments = [];
      state.attachmentUrls = action.payload.attachmentUrls || [];
      state.tags = action.payload.tags;
      state.editingBlogId = action.payload._id;
      state.viewMode = "editor";
      state.saved = true;
    },
    setThumbnail: (state, action: PayloadAction<{ url: string; name: string } | null>) => {
      state.thumbnail = action.payload;
      state.saved = false;
    },
    addAttachment: (state, action: PayloadAction<{ url: string; name: string }>) => {
      state.attachments.push({
        url: action.payload.url,
        name: action.payload.name
      });
      state.attachmentUrls.push(action.payload.url);
      state.saved = false;
    },
    removeAttachment: (state, action: PayloadAction<number>) => {
      state.attachments.splice(action.payload, 1);
      state.attachmentUrls.splice(action.payload, 1);
      state.saved = false;
    },
    resetEditor: (state) => {
      state.title = "";
      state.content = "";
      state.thumbnail = null;
      state.attachments = [];
      state.attachmentUrls = [];
      state.tags = [];
      state.saved = false;
      state.editingBlogId = null;
    },
    setSaved: (state, action: PayloadAction<boolean>) => { 
      state.saved = action.payload;
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
        state.saved = false;
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag !== action.payload);
      state.saved = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.saved = true;
        const newBlog: Blog = {
          _id: action.payload.editingBlogId || Date.now().toString(),
          title: action.payload.title,
          content: action.payload.content,
          author: "Current User",
          authorId: "user-1",
          tags: action.payload.tags,
          // @ts-expect-error: Type mismatch due to incomplete type definitions. Safe to ignore for now.
          thumbnail: action.payload.thumbnailData,
          attachments: action.payload.attachmentData,
          attachmentUrls: action.payload.attachmentData.map(att => att.url),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (action.payload.editingBlogId) {
          const index = state.blogs.findIndex(b => b._id === action.payload.editingBlogId);
          if (index !== -1) {
            state.blogs[index] = newBlog;
          }
        } else {
          state.blogs.push(newBlog);
        }
        state.viewMode = "blogs";
      })
      .addCase(saveBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.attachments = [];
        state.thumbnail = null;
      });
  }
});

export const {
  setTitle,
  setContent,
  setActiveTab,
  setViewMode,
  addBlog,
  updateBlog,
  editBlog,
  setThumbnail,
  addAttachment,
  removeAttachment,
  resetEditor,
  setSaved,
  addTag,
  removeTag,
} = blogSlice.actions;

export default blogSlice.reducer;