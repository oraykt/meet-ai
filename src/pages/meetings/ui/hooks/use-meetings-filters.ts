import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { MeetingStatus } from "../../types";
export const useMeetingsFilter = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
    pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE).withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)).withOptions({ clearOnDefault: true }),
    agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  });
};
