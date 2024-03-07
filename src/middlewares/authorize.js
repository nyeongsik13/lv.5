const authorize = (req, res, next) => {
    if (req.user.usertype !== 'OWNER') {
        return res.status(401).json({ message: "사장님만 사용할 수 있는 API입니다." });
    }
    next();
};

export default authorize;

