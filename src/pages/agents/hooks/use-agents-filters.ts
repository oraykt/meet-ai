import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
export const useAgentsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE).withOptions({ clearOnDefault: true }),
  });
};
