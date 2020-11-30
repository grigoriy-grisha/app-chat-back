import jwt from "jsonwebtoken";
import config from 'config'


export const createJWToken = (id: string) => {
  const token = jwt.sign(
    { data: id},
    config.get('jwtSecret'),
    { expiresIn: config.get('live'), }
  );

  return token;
};
