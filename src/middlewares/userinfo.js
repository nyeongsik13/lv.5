const userinfo = (req, res, next) => {
    if (req.user.usertype !== 'CUSTOMER') {
        return res.status(401).json({ message: "사용자만 사용할 수 있는 API입니다." });
    }
    next();
}

export default userinfo;