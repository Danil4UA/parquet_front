import { useQuery } from "@tanstack/react-query";
import contentServices from "@/services/contentServices";

export const siteContentQueryKey = "siteContent";

export default function useSiteContent() {
  return useQuery({
    queryKey: [siteContentQueryKey],
    queryFn: () => contentServices.getContent(),
    staleTime: 5 * 60 * 1000,
  });
}
