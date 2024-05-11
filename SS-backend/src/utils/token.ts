import jwt from "jsonwebtoken";
const secretKey =
  "7129ab25ffc194b0db5ae3a92b7b4639212758f8b86dc61f98796b8876f73978";



const generateToken = (user: any) => {
    const payload = {
      userId: user.user__id,
      email: user.user__email,
      role: user.role,
      status: user.status,
    };
    const options = {
      expiresIn: "8h", // Token expires in 1 hour (adjust as needed)
    };
    return jwt.sign(payload, secretKey, options);
  };
  export default generateToken;