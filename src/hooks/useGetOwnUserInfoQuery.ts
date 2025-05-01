import { useQuery } from "@tanstack/react-query";
import { getOwnUserInfoQuery } from "@/constants/queryInfo";

export default function useGetOwnUserInfoQuery(session: any) {
  return useQuery(getOwnUserInfoQuery(session));
}
