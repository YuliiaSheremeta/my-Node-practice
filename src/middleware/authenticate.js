import { Session } from '../models/session.js';
import { User } from '../models/userModel.js';
export const authenticate = async (req, res, next) => {
  // 1. Перевіряємо наявність accessToken
  if (!req.cookies.accessToken) {
    next(401, 'Missing access token');
    return;
  }
  // 2. Якщо access токен існує, шукаємо сесію
  const session = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });
  // 3. Якщо такої сесії нема, повертаємо помилку
  if (!session) {
    next(401, 'Session not found');
    return;
  }
  // 4. Перевіряємо термін дії access токена
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(401, 'Access token expired');
  }
  // 5. Якщо з токеном все добре і сесія існує, шукаємо користувача
  const user = await User.findById(session.userId);
  // 6. Якщо користувача не знайдено
  if (!user) {
    next(401);
    return;
  }
  // 7. Якщо користувач існує, додаємо його до запиту
  req.user = user;

  // 8. Передаємо управління далі
  next();
};
