import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  //Перевірка на унікальність email
  if (existingUser) {
    return next('400', 'Email in use');
  }
  //хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  //створюємо користувача
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  //створюємо нову сесію
  const newSession = await createSession(newUser._id);

  //викликаємо та передаємо об*єкт відповіді та сесію
  setSessionCookies(res, newSession);

  res.status(201).json({ newUser });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  //перевіряємо чи існує користувач із цією поштою
  const user = await User.findOne({ email });
  if (!user) {
    return next(401, 'Invalid crendentials');
  }

  //порівнюємо хеші паролів
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return next(401, 'Invalid crendentials');
  }

  //видаляємо страру сесію щоб не було конфліктів
  await Session.deleteOne({ userId: user._id });

  //створюємо нову
  const newSession = await createSession(user._id);

  //викликаємо та передаємо об*єкт відповіді та сесію
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  //видаляємо сесію якщо існує
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  //видаляємо всі куки
  res.clearCookie('sesionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  //поверта\мо статус 204 No Content
  res.status(204).send();
};

export const refreshUserSession = async (req, res, next) => {
  // 1. Знаходимо поточну сесію за id сесії та рефреш токеном
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  // 2. Якщо такої сесії нема, повертаємо помилку
  if (!session) {
    return next(401, 'Session not found');
  }
  // 3. Якщо сесія існує, перевіряємо валідність рефреш токена
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  // Якщо термін дії рефреш токена вийшов, повертаємо помилку
  if (!isSessionTokenExpired) {
    return next(401, 'Sessin token expired');
  }
  // 4. Якщо всі перевірки пройшли добре, видаляємо поточну сесію
  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  // 5. Створюємо нову сесію та додаємо кукі
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};
