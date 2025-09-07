import { useEffect, useState } from "react";

import { contentsApi } from "../../shared/apis";

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

  return (
    <div className="home">
      {data?.map((item) => {
        return (
          <div key={item.id}>
            {item.title} - {item.authorId}
          </div>
        );
      })}
    </div>
  );
};

export default HomeTemplate;
