import { http } from "../configs/api";

type TVisitorStatsResp = {
  date: string;
  count: number;
}[];

const prefix = "analysis";

export default {
  visitorStats: (query: { startDate: string; endDate: string }) => ({
    request: http.get<TVisitorStatsResp>,
    path: `${prefix}/visitor-stats`,
    searchParams: new URLSearchParams(
      query as unknown as Record<string, string>
    ).toString(),
  }),
};
