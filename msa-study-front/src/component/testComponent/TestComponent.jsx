import { useState } from "react";
import { testApi, testPostApi } from "../../service/testService/testService.js";
import { aesDecrypt, aesEncrypt } from "../../util/aesCrypto.js";

export default function TestComponent() {
  const [memberData, setMemberData] = useState();
  const [memberPostData, setMemberPostData] = useState();

  // api test
  const apiTest = async () => {
    const option = {
      url: "/api/test/testGet",
      method: "GET",
    };
    const response = await testApi(option);
    if (response.status === 200) {
      setMemberData(response.data);
    }
  };

  const handleClick = () => {
    apiTest();
  };

  const apiPostTest = async () => {
    // 암호화
    let encData = aesEncrypt("xormsdlrnt@naver.com");

    // 복호화
    let decData = aesDecrypt(encData);
    console.log(encData);
    console.log(decData);

    const param = {
      pmUserId: encData,
    };

    const option = {
      url: "api/test/testPost",
      method: "POST",
      data: param,
    };

    const response = await testPostApi(option);
    if (response.status === 200) {
      console.log(response.data);
      setMemberPostData(response.data);
    }
  };

  const hadlePostClick = () => {
    apiPostTest();
  };

  return (
    <div>
      <br />
      <h2>TEST</h2>
      <button onClick={handleClick}>데이터 불러오기 Get js</button>
      <button onClick={hadlePostClick}>데이터 불러오기 Post js</button>

      {memberData?.map((data, index) => (
        <div key={index}>{data.pmName}</div>
      ))}

      <div>{memberPostData?.pmUserId}</div>

      <br />
    </div>
  );
}
