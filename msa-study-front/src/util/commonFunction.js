// 이메일 정규식 체크 공통함수
export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

// 비밀번호 정규식 체크 공통함수
export const validatePassword = (password) => {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()-]).{8,20}$/;
  return passwordPattern.test(password);
};

// 공통 정규식 패턴
const patterns = {
  name: /^[가-힣]{2,16}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/,
  phone: /^01[0-9]\d{8}$/,
  password: /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()-]).{8,20}$/,
};

// 유효성 검사 함수
export const validators = {
  name: (value) => patterns.name.test(value),
  email: (value) => patterns.email.test(value),
  phone: (value) => patterns.phone.test(value),
  password: (value) => patterns.password.test(value),
};
