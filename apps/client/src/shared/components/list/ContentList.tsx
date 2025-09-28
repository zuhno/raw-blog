import { Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { contentsApi, tagsApi } from "../../apis";
import { formatDateLocale } from "../../utils/date";

interface IProps {
  type: "POST" | "DAILY" | "ALL";
  showLabel?: boolean;
  isOwner?: boolean;
}

type ListData = NonNullable<
  Awaited<ReturnType<typeof contentsApi.getList>>["data"]
>["contents"];

const ContentList = ({ type, isOwner, showLabel }: IProps) => {
  const [data, setData] = useState<ListData>([]);
  const [tagName, setTagName] = useState("");
  const { tagId } = useSearch({ strict: false }) as unknown as {
    tagId: string;
  };

  useEffect(() => {
    contentsApi
      .getList({
        ...(type !== "ALL" && { type }),
        ...(isOwner && { owner: true }),
        ...(tagId && { tagIds: [tagId] }),
      })
      .then((res) => {
        if (res.success) setData(res.data.contents);
      });
    if (tagId) {
      tagsApi.getSearchById(+tagId).then((res) => {
        if (res.success) setTagName(res.data.name);
      });
    } else setTagName("");
  }, [tagId, type, isOwner]);

  if (!data.length) return;

  return (
    <div>
      {tagName && <h2>Tag: {tagName}</h2>}
      {data.map((item) => {
        return (
          <div key={item.id} style={{ marginBottom: 20 }}>
            <Link to="/detail/$id" params={{ id: "" + item.id }}>
              {item.title}
            </Link>
            <div>{formatDateLocale(item.createdAt)}</div>
            {showLabel && (
              <div style={{ display: "flex", gap: 5, pointerEvents: "none" }}>
                {isOwner && (
                  <>
                    <button>{item.private ? "private" : "public"}</button>
                    <button>
                      {item.publish ? "published" : "unpublished"}
                    </button>
                  </>
                )}
                <button>{item.type.toLowerCase()}</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContentList;
