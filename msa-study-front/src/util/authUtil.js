import { POST } from "../service/fetch-auth-action.ts";

export const createTokenHeader = async () => {
  const userJSON = localStorage.getItem("pl_user_info");
  let accessToken = null;
  if (userJSON) {
    accessToken = JSON.parse(userJSON).accessToken;
    const refreshToken = JSON.parse(userJSON).refreshToken;
    const accessTokenExpiresIn = TimestampToDate(JSON.parse(userJSON).accessTokenExpiresIn);
    const currentDate = new Date();

    // 엑세스토큰 유효기간과 현재 날짜 비교
    if (accessTokenExpiresIn > currentDate) {
      return {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
    }
    // 엑세스토큰 유효기간이 만료되었으면, 새로운 엑세스토큰 발급
    else if (accessTokenExpiresIn < currentDate) {
      console.log("토큰 만료 : accessToken 재발급");
      const URL = "/api/auth/reissue";
      const response = await POST(URL, { accessToken: accessToken, refreshToken: refreshToken }, null);

      if (response.status === 200) {
        console.log("accessToken 발급 완료");
        // 토큰을 로컬스토리지에 새로 저장
        localStorage.setItem("pl_user_info", JSON.stringify(response.data));

        return {
          headers: {
            Authorization: "Bearer " + response.data.accessToken,
          },
        };
      } else {
        console.log("accessToken 발급 불가");
        alert("accessToken 발급 불가");
        localStorage.removeItem("pl_user_info");
        document.location.href = "/login2024";
        return null;
      }
    }
  } else {
    // 인증인가가 필요한 api에 로그인을 하지 않았다면,
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      localStorage.removeItem("pl_user_info");
      return null;
    }
    return null;
    // return {
    //   headers: {
    //     Authorization: "Bearer " + accessToken,
    //   },
    // };
  }
};

// timeStamp 데이터 형식 변환
const TimestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  return date;
};

export const logOut = () => {
  window.location.href = "/";
  localStorage.removeItem("pl_user_info");
};
