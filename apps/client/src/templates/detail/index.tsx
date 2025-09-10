import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { contentsApi } from "../../shared/apis";
import Editor from "../../shared/components/tiptap/Editor";
import { formatDateLocale } from "../../shared/utils/date";
import type { Nullable } from "../../shared/utils/type";

type TData = Nullable<
  Awaited<ReturnType<typeof contentsApi.getDetail>>["data"]
>;

const DetailTemplate = () => {
  const { id } = useParams({ strict: false });

  const [data, setData] = useState<TData>(null);

  useEffect(() => {
    if (!id) return;
    contentsApi.getDetail(+id).then((res) => {
      if (res.success) setData(res.data);
    });
  }, [id]);

  if (!data) return;

  return (
    <>
      <title>{data.title}</title>
      <div>
        <h2>{data.title}</h2>
        <p>
          {formatDateLocale(data.createdAt)}
          {" / "}
          <span style={{ textTransform: "capitalize" }}>
            {data.type.toLowerCase()}
          </span>
        </p>
        <article style={{ marginTop: 30 }}>
          <Editor editable={false} content={JSON.parse(data.body)} />
        </article>
      </div>
    </>
  );
};

export default DetailTemplate;
