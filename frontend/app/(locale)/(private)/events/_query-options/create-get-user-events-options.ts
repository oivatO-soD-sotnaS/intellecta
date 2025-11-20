import { handleApiErrors } from "@/app/[locale]/_utils/handle-api-errors";
import { ITranslations } from "@/app/[locale]/_utils/interfaces";
import { queryOptions, UseQueryOptions } from "@tanstack/react-query";

export function createGetUserKeywordsOptions(
  t: ITranslations,
  options?: Omit<
    UseQueryOptions<string[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return queryOptions({
    ...options,
    queryKey: ['userKeywords'],
    queryFn: () => getUserKeywords(t),
    staleTime: Infinity
  });
}

async function getUserKeywords(t: ITranslations): Promise<string[]> {
  const response = await fetch('/api/users/me/events');
  
  return response.json();
}