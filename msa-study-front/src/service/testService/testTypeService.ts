import axios from "axios";

type parmasType = {
  url: string;
  method: string;
  header: any;
  data: any;
};
export const testTypeApi = async (param: parmasType) => {
  return await axios(param);
};
