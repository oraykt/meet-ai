import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { MeetingStatus } from "./types";

export const filtersSearchParamsForMeetings = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE).withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(MeetingStatus)),
  agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(filtersSearchParamsForMeetings);
