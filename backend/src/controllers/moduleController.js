const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

const formatModule = (module) => ({
  id: module.id,
  title: module.title,
  description: module.description,
  tags: (() => { try { return JSON.parse(module.tags); } catch { return []; } })(),
  type: module.type,
  technology: module.technology,
  price: module.price,
  githubUrl: module.githubUrl,
  fileUrl: module.fileUrl,
  status: module.status,
  downloads: module.downloads,
  earnings: module.earnings,
  authorId: module.authorId,
  author: module.author
    ? {
        id: module.author.id,
        name: module.author.name,
        avatarUrl: module.author.avatarUrl,
        score: module.author.score,
      }
    : undefined,
  createdAt: module.createdAt,
  updatedAt: module.updatedAt,
});

const listModules = async (req, res) => {
  try {
    const { technology, type, tags, search, page = 1, limit = 20 } = req.query;

    const where = { status: 'approved' };

    if (technology) where.technology = technology;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let modules = await prisma.module.findMany({
      where,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    });

    // Filter by tags if provided
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      modules = modules.filter(m => {
        const moduleTags = (() => { try { return JSON.parse(m.tags); } catch { return []; } })();
        return tagList.some(tag => moduleTags.map(t => t.toLowerCase()).includes(tag));
      });
    }

    const total = await prisma.module.count({ where });

    res.json({
      success: true,
      data: {
        modules: modules.map(formatModule),
        pagination: { page: parseInt(page), limit: parseInt(limit), total },
      },
    });
  } catch (err) {
    console.error('List modules error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch modules' });
  }
};

const createModule = async (req, res) => {
  try {
    const { title, description, tags, type, technology, price, githubUrl } = req.body;

    if (!title || !description || !type || !technology) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, type, and technology are required',
      });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' && tags.trim()
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : []);

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const module = await prisma.module.create({
      data: {
        title,
        description,
        tags: JSON.stringify(tagsArray),
        type,
        technology,
        price: parseFloat(price) || 0,
        githubUrl: githubUrl || null,
        fileUrl,
        authorId: req.user.id,
      },
      include: { author: true },
    });

    res.status(201).json({
      success: true,
      message: 'Module submitted successfully. It will be reviewed by our team.',
      data: { module: formatModule(module) },
    });
  } catch (err) {
    console.error('Create module error:', err);
    res.status(500).json({ success: false, message: 'Failed to create module' });
  }
};

const getMyModules = async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      where: { authorId: req.user.id },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const totalEarnings = modules.reduce((sum, m) => sum + m.earnings, 0);
    const totalDownloads = modules.reduce((sum, m) => sum + m.downloads, 0);

    res.json({
      success: true,
      data: {
        modules: modules.map(formatModule),
        stats: {
          totalModules: modules.length,
          totalEarnings,
          totalDownloads,
          score: req.user.score,
          approvedModules: modules.filter(m => m.status === 'approved').length,
          pendingModules: modules.filter(m => m.status === 'pending').length,
        },
      },
    });
  } catch (err) {
    console.error('Get my modules error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch your modules' });
  }
};

const getModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    res.json({ success: true, data: { module: formatModule(module) } });
  } catch (err) {
    console.error('Get module error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch module' });
  }
};

const updateModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({ where: { id } });
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    if (module.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, description, tags, type, technology, price, githubUrl } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (technology !== undefined) updateData.technology = technology;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;

    if (tags !== undefined) {
      const tagsArray = Array.isArray(tags)
        ? tags
        : (typeof tags === 'string' && tags.trim()
          ? tags.split(',').map(t => t.trim()).filter(Boolean)
          : []);
      updateData.tags = JSON.stringify(tagsArray);
    }

    if (req.file) {
      updateData.fileUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.module.update({
      where: { id },
      data: updateData,
      include: { author: true },
    });

    res.json({
      success: true,
      message: 'Module updated successfully',
      data: { module: formatModule(updated) },
    });
  } catch (err) {
    console.error('Update module error:', err);
    res.status(500).json({ success: false, message: 'Failed to update module' });
  }
};

const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await prisma.module.findUnique({ where: { id } });
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    if (module.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await prisma.purchase.deleteMany({ where: { moduleId: id } });
    await prisma.module.delete({ where: { id } });

    res.json({ success: true, message: 'Module deleted successfully' });
  } catch (err) {
    console.error('Delete module error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete module' });
  }
};

module.exports = { listModules, createModule, getMyModules, getModule, updateModule, deleteModule };
