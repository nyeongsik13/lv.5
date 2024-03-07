export default function (err, req, res, next) {
    console.error(err);

    // Joi 검증에서 에러가 발생하면, 클라이언트에게 에러 메시지를 전달합니다.
    if (err.name === 'ValidationError') {
        return res.status(400).json({ errorMessage: err.message });
    }
    if (err.message === 'DuplicateUserError') {
        return res.status(409).json({ message: '이미 존재하는 사용자입니다.' });
    }
    if(err.message === 'loginError'){
        return res.status(400).json({message: '닉네임 또는 패스워드를 확인해주세요.'})
    }
    if(err.message === 'invalidDataFormatError'){
        return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다' });
    }
    if(err.message === 'noncategoryError'){
        return res.status(404).json({ message: '존재하지 않는 카테고리입니다.' });
    }
    if(err.message === 'nonmenuError'){
        return res.status(404).json({ message: '존재하지 않는 메뉴입니다.' });
    }
    // 그 외의 에러가 발생하면, 서버 에러로 처리합니다.
    return res.status(500).json({ errorMessage: '서버에서 에러가 발생하였습니다.' });
}