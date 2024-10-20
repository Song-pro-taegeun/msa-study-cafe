import { useState } from "react";
import { validators } from "../../util/commonFunction";
import Verification from "./Verification";
import { aesDecrypt } from "../../util/aesCrypto";
import { sendEmailApi } from "../../service/authService";
import { signUpApi } from "../../service/authService";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  // 페이지 이동
  const nav = useNavigate();

  // 회원가입 데이터
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [step, setStep] = useState({
    level1: true, // 학생/강사
    level2: false, // 이름
    level3: false, // 이메일
    level3_1: false, // 인증 코드
    level4: false, // 핸드폰
    level5: false, // 비밀번호
  });

  // 인증 코드 복호화 데이터
  const [decryptValue, setDecryptValue] = useState();

  // 인증 확인 데이터
  const [message, setMessage] = useState();

  // 이메일 인증 코드 데이터
  const prop = {
    formData,
    setFormData,
    step,
    setStep,
    decryptValue,
    message,
    setMessage,
  };

  // 회원가입 유효성 검사 에러메시지
  const [formError, setFormErrors] = useState({});

  // 회원가입
  const handleNextStep = () => {
    // 회원가입 에러 정보
    let formErrorInfo = {};

    // 회원가입 - 학생/강사 시작
    if (step.level1) {
      if (!formData.userType) {
        formErrorInfo.userType = "학생 또는 강사를 선택하세요";
        console.log(formData.userType);
      }

      if (Object.keys(formErrorInfo).length > 0) {
        setFormErrors(formErrorInfo);
      } else {
        console.log(formData.userType);
        setStep({ ...step, level1: false, level2: true });
        setFormErrors({});
      }
    } // 회원가입 - 학생/강사 끝

    // 회원가입 - 이름 시작
    else if (step.level2) {
      if (!formData.name) {
        formErrorInfo.name = "이름을 입력하세요";
      } else if (!validators.name(formData.name)) {
        formErrorInfo.name = "규칙에 맞는 이름을 입력해주세요";
      }

      if (Object.keys(formErrorInfo).length > 0) {
        setFormErrors(formErrorInfo);
      } else {
        console.log(formData.name);
        setStep({ ...step, level2: false, level3: true });
        setFormErrors({});
      }
    } // 회원가입 - 이름 끝

    // 회원가입 - 이메일 시작 - 인증코드 성공, 실패
    else if (step.level3) {
      if (!formData.email) {
        formErrorInfo.email = "이메일을 입력하세요";
      } else if (!validators.email(formData.email)) {
        formErrorInfo.email = "이메일 형식이 잘못되었습니다.";
      }

      if (Object.keys(formErrorInfo).length > 0) {
        setFormErrors(formErrorInfo);
      } else {
        setStep({ ...step, level3: false, level4: true });
        setFormErrors({});
      }
    } // 회원가입 - 이메일 끝

    // 회원가입 - 핸드폰 시작
    else if (step.level4) {
      console.log(formData.phone);
      if (!formData.phone) {
        formErrorInfo.phone = "핸드폰 번호를 입력하세요";
      } else if (!validators.phone(formData.phone)) {
        formErrorInfo.phone = "규칙에 맞는 휴대폰 번호를 입력해주세요";
      }

      if (Object.keys(formErrorInfo).length > 0) {
        setFormErrors(formErrorInfo);
      } else {
        setStep({ ...step, level4: false, level5: true });
        setFormErrors({});
      }
    } // 회원가입 - 핸드폰 끝

    // 회원가입 - 비밀번호 시작
    else if (step.level5) {
      if (!formData.password) {
        formErrorInfo.password = "비밀번호를 입력하세요";
      } else if (!validators.password(formData.password)) {
        formErrorInfo.password = "비밀번호 형식이 잘못되었습니다.";
      }

      if (!formData.passwordConfirm) {
        formErrorInfo.passwordConfirm = "비밀번호 확인을 입력하세요";
      } else if (formData.password !== formData.passwordConfirm) {
        formErrorInfo.passwordConfirm = "비밀번호가 일치하지 않습니다.";
      }

      if (Object.keys(formErrorInfo).length > 0) {
        setFormErrors(formErrorInfo);
      } else {
        console.log("비밀번호 인증 확인완료");
        console.log(formData);
        callSignUp();
      }
    }
  };
  // 회원가입 API
  const callSignUp = async () => {
    const singUpData = {
      userRole: formData.userType,
      userName: formData.name,
      email: formData.email,
      pmPhone: formData.phone,
      password: formData.password,
    };
    const response = await signUpApi(singUpData);
    if (response.status === 200) {
      nav("/signIn");
    } else {
      alert("회원가입 실패");
    }
  };

  // 회원가입 - 인증 발송
  const handleSendClick = () => {
    let formErrorInfo = {};

    if (!formData.email) {
      formErrorInfo.email = "이메일을 입력하세요";
    } else if (!validators.email(formData.email)) {
      formErrorInfo.email = "이메일 형식이 잘못되었습니다.";
    }

    if (Object.keys(formErrorInfo).length > 0) {
      setFormErrors(formErrorInfo);
    } else {
      setFormErrors({});
      callSendCode();
    }
  };

  // 인증 코드 API
  const callSendCode = async () => {
    try {
      const response = await sendEmailApi(formData.email);
      console.log(formData.email);
      console.log(response.data);
      if (response.data === 1) {
        setFormErrors({ email: "이미 가입된 이메일입니다." });
        setStep({ ...step, level3_1: false });
      } else {
        setFormErrors({ email: "" });
        setStep({ ...step, level3_1: true });
        const decryptedValue = aesDecrypt(response.data);
        setDecryptValue(decryptedValue);
        console.log(decryptedValue); // 암호 해제된 값 출력
      }
    } catch (error) {
      console.log("이메일 인증 발송 중 오류 발생 : ", error);
    }
  };
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="signUp">SignUp</div>
      <div>Study Cafe 계정 만들기</div>
      <br />

      {step.level1 && (
        <>
          <span>학생 / 강사를 선택 하세요</span>
          <div className="userType">
            <select
              name="userType"
              id="userType"
              value={formData.userType}
              onChange={(e) => {
                setFormData({ ...formData, userType: e.target.value });
              }}
            >
              <option value="">선택</option>
              <option value="student">학생</option>
              <option value="instructor">강사</option>
            </select>
            <button onClick={handleNextStep}>다음</button>
            {formError.userType && <span style={{ color: "red" }}>{formError.userType}</span>}
          </div>
        </>
      )}

      {step.level2 && (
        <>
          <span>이름을 입력하세요</span>
          <br></br>
          <input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          ></input>
          <button onClick={handleNextStep}>다음</button>
          {formError.name && <span style={{ color: "red" }}>{formError.name}</span>}
        </>
      )}
      {step.level3 && (
        <>
          <span>이메일을 입력하세요</span>
          <input
            type="text"
            placeholder="이메일"
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          ></input>
          <button onClick={handleSendClick}>인증 발송</button>
          <br></br>
          {step.level3_1 && <Verification prop={prop} />}
          <br></br>
          <button onClick={handleNextStep} disabled={!message}>
            다음
          </button>
          {formError.email && <span style={{ color: "red" }}>{formError.email}</span>}
        </>
      )}
      {step.level4 && (
        <>
          <span>휴대폰 번호(숫자만)를 입력하세요</span>
          <br></br>
          <input
            type="tel"
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
            }}
          />
          <button onClick={handleNextStep}>다음</button>
          {formError.phone && <span style={{ color: "red" }}>{formError.phone}</span>}
        </>
      )}
      {step.level5 && (
        <>
          <span>비밀번호 입력</span>
          <br></br>
          <input
            type="password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          {formError.password && <span style={{ color: "red" }}>{formError.password}</span>}
          <br></br>
          <br></br>
          <span>비밀번호 확인</span>
          <br></br>
          <input
            type="password"
            onChange={(e) => {
              setFormData({ ...formData, passwordConfirm: e.target.value });
            }}
          />
          {formError.passwordConfirm && <span style={{ color: "red" }}>{formError.passwordConfirm}</span>}
          <br></br>
          <br></br>
          {step.level5 && <button onClick={handleNextStep}>완료</button>}
        </>
      )}
    </>
  );
}
