const { Profile } = require('../models');
const { errorResponse } = require('../shared/helper');

const getProfile = async (req, res, next) => {
  const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
  if (!profile) return res.status(401).json(errorResponse('You have no authentication information.'));
  req.profile = profile;
  next();
};
module.exports = { getProfile };