import { AxiosError, AxiosResponse } from "axios";

export default function emptyDataOnError<TData>(error: AxiosError, expected: any) {
  return {
    data: expected,
    status: error.response?.status || 500,
    statusText: error.response?.statusText || "Internal Server Error",
    headers: error.response?.headers || {},
    config: error.config,
  } as AxiosResponse<TData>;
}
