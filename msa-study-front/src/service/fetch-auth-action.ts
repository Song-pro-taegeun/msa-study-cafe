import axios, { AxiosError, AxiosResponse } from "axios";

type ServerError = { errorMessage: string };

interface FetchData {
  method: string;
  url: string;
  data?: {};
  header: {};
}

const fetchAuth = async (fetchData: FetchData) => {
  const method = fetchData.method;
  const url = fetchData.url;
  const data = fetchData.data;
  const header = fetchData.header;

  try {
    const response: AxiosResponse<any, any> | false =
      (method === "get" && (await axios.get(url, header))) ||
      (method === "post" && (await axios.post(url, data, header))) ||
      (method === "put" && (await axios.put(url, data, header))) ||
      (method === "delete" && (await axios.delete(url, header)));

    if (response && response.data.error) {
      console.log(response.data.error);
      return null;
    }

    // @ts-ignore
    // 성공적으로 반환
    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err as AxiosError<ServerError>;
      if (serverError && serverError.response) {
        console.log(serverError.response.data);

        if (err?.response?.data.status === 500) {
          alert("서버 에러입니다.");
        }

        return null;
      }
    }
  }
};

const GET = (url: string, header: {}) => {
  const response = fetchAuth({ method: "get", url, header });
  return response;
};

const POST = (url: string, data: {}, header: {}) => {
  const response = fetchAuth({ method: "post", url, data, header });
  return response;
};

const PUT = async (url: string, data: {}, header: {}) => {
  const response = fetchAuth({ method: "put", url, data, header });
  return response;
};

const DELETE = async (url: string, header: {}) => {
  const response = fetchAuth({ method: "delete", url, header });
  return response;
};

export { GET, POST, PUT, DELETE };
