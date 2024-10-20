import { useEffect, useState } from "react";

export default function Verification({ prop }) {
  // 확인코드 오류 체크
  // 추후 퍼블리싱 붙으면 사용 예정임
  const [verifiStatus, setVerifiStatus] = useState("init");
  const [time, setTime] = useState(600); // 10분 = 600초
  const {
    formData,
    setFormData,
    step,
    setStep,
    decryptValue,
    message,
    setMessage,
  } = prop;
  useEffect(() => {
    if (step.level2 || step.level3_1) {
      setVerifiStatus("init"); // 코드 입력 폼 초기화
      setTime(600); // 시간 초기화
      const intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime < 1) {
            clearInterval(intervalId);
            setVerifiStatus("error");
          } else {
            return prevTime > 0 ? prevTime - 1 : 0;
          }
        });
      }, 1000);
    }
  }, [step.level2, step.level3_1]);

  // 시간을 mm:ss 형식으로 변환하는
  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const handleCodeCheck = () => {
    if (formData.code === decryptValue) {
      setMessage("인증 확인");
      setTime(9999999);
      setVerifiStatus("complate");
      // setStep({ ...step, level2: false, level3: true });
    } else {
      setVerifiStatus("error");
      setMessage();
    }
  };

  return (
    <>
      <span>인증코드</span>
      <input
        type="number"
        onChange={(e) => {
          setFormData({ ...formData, code: e.target.value });
        }}
      />
      <span>{formatTime(time)}</span>
      <button onClick={handleCodeCheck}>확인</button>
      {message && <span style={{ color: "green" }}>{message}</span>}
    </>
  );
}
