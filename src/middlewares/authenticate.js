import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const token = req.cookies['token'];
    const formattedToken = token ? token.replace("Bearer ", "") : null;

    try {
      const decoded = jwt.verify(formattedToken, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }

    if (!formattedToken) {
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }
};



export default authenticate;

