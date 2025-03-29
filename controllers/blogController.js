// controllers/blogController.js
const Blog = require('../models/Blog');

// Helper function to generate slug from title
const generateSlug = (title) => {
    let slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
    
    // If the slug is empty or just a hyphen, add a random string
    if (!slug || slug === '-') {
      const randomStr = Math.random().toString(36).substring(2, 10);
      slug = `post-${randomStr}`;
    }
    
    return slug;
  };

// Get all blogs (published only for public API)
exports.getAllBlogs = async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { published: true };
    
    const blogs = await Blog.find(query)
      .sort({ date: -1 }) // Newest first
      .select('-__v');
    
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error when fetching blogs' });
  }
};

// Get a single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      published: true 
    }).select('-__v');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error when fetching blog' });
  }
};

// Create a new blog (admin only)
// Create a new blog (admin only)
exports.createBlog = async (req, res) => {
    try {
      const blogData = { ...req.body };
      
      // Generate slug if not provided
      if (!blogData.slug && blogData.title) {
        blogData.slug = generateSlug(blogData.title);
      }
      
      // Check if slug already exists
      const existingBlog = await Blog.findOne({ slug: blogData.slug });
      if (existingBlog) {
        // Add timestamp to make slug unique
        const timestamp = Date.now().toString().slice(-4);
        blogData.slug = `${blogData.slug}-${timestamp}`;
      }
      
      const newBlog = new Blog(blogData);
      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
    } catch (error) {
      console.error('Error creating blog:', error);
      
      if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ message: 'A blog with this slug already exists' });
      }
      
      res.status(500).json({ message: 'Server error when creating blog' });
    }
  };

// Update a blog (admin only)
exports.updateBlog = async (req, res) => {
  try {
    const blogData = { ...req.body };
    
    // Generate slug if title changed and slug not provided
    if (blogData.title && !blogData.slug) {
      blogData.slug = generateSlug(blogData.title);
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id, 
      blogData,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this slug already exists' });
    }
    
    res.status(500).json({ message: 'Server error when updating blog' });
  }
};

// Delete a blog (admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ message: 'Blog successfully deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error when deleting blog' });
  }
};