import React, { useState } from "react";
import { testTypeApi } from "../../service/testService/testTypeService.ts";

interface Member {
  pmName: string;
}

const TsTestComponent: React.FC = () => {
  const [memberData, setMemberData] = useState<Member[]>([]);

  // api Ts test
  const apiTsTest = async () => {
    const param = {
      url: "/api/test/testGet",
      method: "GET",
      header: null,
      data: null,
    };
    const response = await testTypeApi(param);
    if (response.status === 200) {
      console.log("ts => ", response.data);
    }
  };
  const handleTsClick = () => {
    apiTsTest();
  };

  return (
    <div>
      <br />
      <button onClick={handleTsClick}>데이터 불러오기 ts </button>
      <h2>TS TEST</h2>
      {memberData?.map((data, index) => (
        <div key={index}>{data.pmName}</div>
      ))}
      <br />
    </div>
  );
};

export default TsTestComponent;
