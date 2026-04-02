const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const formatUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  bio: user.bio,
  skills: (() => { try { return JSON.parse(user.skills); } catch { return []; } })(),
  githubUrl: user.githubUrl,
  avatarUrl: user.avatarUrl,
  role: user.role,
  score: user.score,
  createdAt: user.createdAt,
});

const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, githubUrl, avatarUrl } = req.body;

    const skillsArray = Array.isArray(skills)
      ? skills
      : (typeof skills === 'string' && skills.trim()
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : null);

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skillsArray !== null && skills !== undefined) updateData.skills = JSON.stringify(skillsArray);
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: formatUser(user) },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

const getDeveloperProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        modules: {
          where: { status: 'approved' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Developer not found' });
    }

    const publicProfile = {
      ...formatUser(user),
      modules: user.modules.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        tags: (() => { try { return JSON.parse(m.tags); } catch { return []; } })(),
        type: m.type,
        technology: m.technology,
        price: m.price,
        downloads: m.downloads,
        createdAt: m.createdAt,
      })),
    };

    // Remove sensitive fields from public profile
    delete publicProfile.email;

    res.json({ success: true, data: { developer: publicProfile } });
  } catch (err) {
    console.error('Get developer profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch developer profile' });
  }
};

module.exports = { updateProfile, getDeveloperProfile };
