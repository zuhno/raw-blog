import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { contentsApi } from "../../shared/apis";
import { formatDateLocale } from "../../shared/utils/date";

type ListData = NonNullable<
  Awaited<ReturnType<typeof contentsApi.getList>>["data"]
>["contents"];

const HomeTemplate = () => {
  const [data, setData] = useState<ListData>([]);

  useEffect(() => {
    contentsApi.getList({ type: "POST" }).then((res) => {
      if (res.success) setData(res.data.contents);
    });
  }, []);

  if (!data.length) return;

  return (
    <div>
      {data.map((item) => {
        return (
          <div key={item.id} style={{ marginBottom: 20 }}>
            <Link to="/detail/$id" params={{ id: "" + item.id }}>
              {item.title}
            </Link>
            <div>{formatDateLocale(item.createdAt)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default HomeTemplate;
