const fs = require('fs');
const sharp = require('sharp');

module.exports = async (req, _, next) => {
  try {
    if (!req.file) return next();
    const filename = `user-${req.payload.userId}-${Date.now()}.jpeg`;
    const dir = 'uploads/images/users/profile-pictures';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const path = `${dir}/${filename}`;
    await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path);
    req.file = { filename, path };
    return next();
  } catch (error) {
    return next(error);
  }
};
