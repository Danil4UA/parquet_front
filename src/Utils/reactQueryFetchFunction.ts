import { AxiosResponse } from "axios";
import emptyDataOnError from "./emptyDataOnError";

type tFetchFunction<T> = (...args: any[]) => Promise<AxiosResponse<T>>

type tExpected<T> = T extends any[] ? [] : T extends object ? {} : never;

export default async function reactQueryFetchFunction<T>(
  fetchFunction: tFetchFunction<T>,
  expected: tExpected<T>,
  ...args: any[]
): Promise<AxiosResponse<T>> {
  return fetchFunction(...args).catch((err) => emptyDataOnError(err, expected));
}
