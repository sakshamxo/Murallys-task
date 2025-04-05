import jwt from 'jsonwebtoken';

export const sendToken = (user, res, statusCode = 200, message = 'Success') => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  // Optional: hide sensitive info
  user.password = undefined;

  res.status(statusCode).json({
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
    },
  });
};
