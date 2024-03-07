import joi from 'joi';

export const createCategorySchema = joi.object({
    name: joi.string().min(1).max(10).required().messages({
        'string.empty': '제목을 입력해주세요.',
        'string.min': '제목은 최소 1글자 이상이어야 합니다.',
        'string.max': '제목은 최대 10글자를 초과할 수 없습니다.',
    }),
});

export const createMenuSchema = joi.object({
    name: joi.string().min(1).max(10).required().messages({
        'string.empty': '제목을 입력해주세요.',
        'string.min': '제목은 최소 1글자 이상이어야 합니다.',
        'string.max': '제목은 최대 10글자를 초과할 수 없습니다.',
    }),
    description: joi.string().min(1).max(50).required().messages({
        'string.empty': '내용을 입력해주세요.',
        'string.min': '제목은 최소 1글자 이상이어야 합니다.',
        'string.max': '제목은 최대 50글자를 초과할 수 없습니다.',
    }),
    image: joi.string().min(1).max(200).required().messages({}),
    price: joi.number().strict().greater(0).required().messages({
        'any.required': '메뉴 가격을 입력해주세요.',
        'number.greater': '메뉴 가격은 0보다 작을 수 없습니다.', // min(0) 으로 설정하면 0이 허용돼서 greater로 수정했습니다.
        'number.base': '숫자를 입력해주세요.', // 'number.base': 숫자 값이 예상되지만 잘못된 유형의 값이 전달된 경우에 대한 오류 메시지를 정의할 수 있다. ex: 문자열
    }),
    quantity: joi.number().strict().greater(0).required().messages({
        'any.required': '메뉴 개수를 입력해주세요',
        'number.greater': '메뉴 개수 0보다 작을 수 없습니다.', // min(0) 으로 설정하면 0이 허용돼서 greater로 수정했습니다.
        'number.base': '숫자를 입력해주세요.', // 'number.base': 숫자 값이 예상되지만 잘못된 유형의 값이 전달된 경우에 대한 오류 메시지를 정의할 수 있다. ex: 문자열
    }),
});

export const signUpSchema = joi.object({
    nickname: joi.string().pattern(/^[a-zA-Z0-9]{3,15}$/).required().messages({
        'string.pattern.base': '닉네임 형식에 일치하지 않습니다.',
        'any.required': '닉네임을 입력해주세요.',
    }),
    password: joi.string().min(8).max(20).required().invalid(joi.ref('nickname')).messages({
        'string.empty': '비밀번호를 입력해주세요.',
        'string.min': '비밀번호는 최소 8자 이상이어야 합니다.',
        'string.max': '비밀번호는 최대 20자를 초과할 수 없습니다.',
        'any.required': '비밀번호를 입력해주세요.',
        'any.invalid': '비밀번호에 닉네임을 포함할 수 없습니다.',
    }),
    usertype: joi.string().valid('OWNER', 'CUSTOMER').default('CUSTOMER').messages({
        'any.only': '올바른 사용자 유형을 선택해주세요.',
    })

})