function sanitizeUser(user) {
  const { password, otp, otpCreatedAt, ...sanitizedUser } = user;
  return sanitizedUser;
}

module.exports = (message, data, status = 'true') => {
  if (data) {
    const { user, users } = data;
    if (user) {
      const sanitizedUser = sanitizeUser(user);
      const sanitizedData = { ...data, user: sanitizedUser };
      return { status, message, data: sanitizedData };
    }
    if (users && Array.isArray(users)) {
      const sanitizedUsers = users.map(sanitizeUser);
      const sanitizedData = { ...data, users: sanitizedUsers };
      return { status, message, data: sanitizedData };
    }
  }
  return { status, message, data };
};
