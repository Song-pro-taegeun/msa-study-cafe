import { useState } from "react";
import { passwordResetApi, sendCodeApi } from "../../service/authService";
import { aesDecrypt } from "../../util/aesCrypto";
import { useNavigate } from "react-router-dom";
import Verification from "./Verification";
import { validatePassword } from "../../util/commonFunction";

export default function PwdReset() {
  const nav = useNavigate();
  const [step, setStep] = useState({
    level1: true,
    level2: false,
    level3: false,
  });

  const [formData, setFormData] = useState({
    email: null,
    code: null,
    password: null,
    passwordConfirm: null,
  });

  // 인증 확인 데이터
  const [message, setMessage] = useState();

  // 비밀번호 Error useState 설정
  const [formError, setFormError] = useState({
    passwordError: null,
    passwordConfirmError: null,
    passwordMismatchError: null,
  });

  const [decryptValue, setDecryptValue] = useState();

  const prop = {
    formData,
    setFormData,
    step,
    setStep,
    decryptValue,
    message,
    setMessage,
  };

  // 이메일 인증 확인 => 다음 버튼 활성화
  const handleNextStep = () => {
    setStep({ level1: false, level2: false, level3: true });
  };
  const handleSendClick = () => {
    callSendCode();
  };

  const callSendCode = async () => {
    const response = await sendCodeApi(formData.email);
    if (response.status === 200) {
      setDecryptValue(aesDecrypt(response.data));
      setStep({ ...step, level2: true });
    }
  };

  // const handleSubmit = () => {
  //   if (formData.password === formData.passwordConfirm) {
  //     callPasswordReset();
  //   }
  // };

  // 비밀번호 재설정 핸들러 확인체크
  const handleSubmit = () => {
    if (inputCheck()) {
      callPasswordReset();
    }
  };

  const inputCheck = () => {
    let formErrorInfo = {
      passwordError: formError.passwordError,
      passwordConfirmError: formError.passwordConfirmError,
    };

    // passwordCheck();

    // 비밀번호 입력값 체크
    if (!formData.password) {
      formErrorInfo.passwordError = "비밀번호를 입력하세요";
    } else if (!validatePassword(formData.password)) {
      formErrorInfo.passwordError = "비밀번호 형식이 잘못되었습니다.";
    }

    if (!formData.passwordConfirm) {
      formErrorInfo.passwordConfirmError = "비밀번호 확인을 입력하세요";
    } else if (!validatePassword(formData.passwordConfirm)) {
      formErrorInfo.passwordConfirmError =
        "비밀번호 확인 형식이 잘못되었습니다.";
    }

    if (
      formData.password &&
      formData.passwordConfirm &&
      formData.password !== formData.passwordConfirm
    ) {
      formErrorInfo.passwordMismatchError = "비밀번호가 일치하지 않습니다.";
    }

    setFormError(formErrorInfo);

    return (
      !formErrorInfo.passwordError &&
      !formErrorInfo.passwordConfirmError &&
      !formErrorInfo.passwordMismatchError
    );
  };

  const callPasswordReset = async () => {
    const param = {
      pmUserId: formData.email,
      pmPwd: formData.password,
    };
    const response = await passwordResetApi(param);
    if (response.status === 200) {
      nav("/signIn");
    } else {
      setFormError({
        passwordMismatchError: "비밀번호 변경 실패",
      });
    }
  };

  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h2>PWD RESET</h2>
      {step.level1 && (
        <>
          <span>이메일</span>
          <input
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          <button onClick={handleSendClick}>발송</button>
          <br></br>
          <br></br>
          {step.level2 && (
            <>
              <Verification prop={prop} />
              <button onClick={handleNextStep} disabled={!message}>
                다음
              </button>
            </>
          )}
        </>
      )}
      {step.level3 && (
        <>
          <span>새 비밀번호 입력</span>
          <input
            type="password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          {formError.passwordError && (
            <span style={{ color: "red" }}>{formError.passwordError}</span>
          )}
          <br />
          <span>새 비밀번호 확인</span>
          <input
            type="password"
            onChange={(e) => {
              setFormData({ ...formData, passwordConfirm: e.target.value });
            }}
          />
          {formError.passwordConfirmError && (
            <span style={{ color: "red" }}>
              {formError.passwordConfirmError}
            </span>
          )}

          <button onClick={handleSubmit}>설정완료</button>
          <br />
          {formError.passwordMismatchError && (
            <span style={{ color: "red" }}>
              {formError.passwordMismatchError}
            </span>
          )}
        </>
      )}
    </>
  );
}
