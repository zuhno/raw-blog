import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { tagsApi } from "../../shared/apis";

type TData = NonNullable<
  Awaited<ReturnType<typeof tagsApi.getListWithCount>>["data"]
>;

const TagTemplate = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<TData>([]);

  const toListByTag = (tagId: number) => {
    navigate({
      to: "/",
      search: { tagId },
    });
  };

  useEffect(() => {
    tagsApi
      .getListWithCount()
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(() => {});
  }, [setData]);

  if (!data.length) return;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {data.map((item) => (
        <button key={item.id} onClick={() => toListByTag(item.id)}>
          {item.name} {item.contentsCount}
        </button>
      ))}
    </div>
  );
};

export default TagTemplate;
