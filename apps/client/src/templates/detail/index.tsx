import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { contentsApi } from "../../shared/apis";
import useTiptapEditor from "../../shared/hooks/useTiptapEditor";
import { formatDateLocale } from "../../shared/utils/date";
import type { Nullable } from "../../shared/utils/type";

type TData = Nullable<
  Awaited<ReturnType<typeof contentsApi.getDetail>>["data"]
>;

const DetailTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const [data, setData] = useState<TData>(null);
  const [isOwner, setIsOwner] = useState(false);

  const { setContent, TiptapEditor } = useTiptapEditor({ editable: false });

  const toEdit = () => {
    navigate({ to: "/edit/$id", params: { id: "" + id } });
  };

  useEffect(() => {
    if (!id) return;
    contentsApi
      .getVerify(+id)
      .then((res) => {
        if (res.success) setIsOwner(true);
      })
      .catch(() => {});
    contentsApi.getDetail(+id).then((res) => {
      if (res.success) {
        setData(res.data);
        setContent(res.data.body);
      }
    });
  }, [id, setContent]);

  if (!data) return;

  return (
    <>
      <title>{data.title}</title>
      <div>
        <h1>{data.title}</h1>
        <p>
          {formatDateLocale(data.createdAt)}
          {" | "}
          <span style={{ textTransform: "capitalize" }}>
            {data.type.toLowerCase()}
          </span>
          {isOwner && (
            <>
              {" | "}
              <button onClick={toEdit}>Edit</button>
            </>
          )}
        </p>
        <article style={{ marginTop: 30 }}>
          <TiptapEditor />
        </article>
      </div>
    </>
  );
};

export default DetailTemplate;
