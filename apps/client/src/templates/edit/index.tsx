import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { contentsApi } from "../../shared/apis";
import Editor from "../../shared/components/tiptap/Editor";
import type { Nullable } from "../../shared/utils/type";

type TData = Nullable<
  Awaited<ReturnType<typeof contentsApi.getDetail>>["data"]
>;

const EditTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const [data, setData] = useState<TData>(null);

  useEffect(() => {
    if (!id) return;
    contentsApi.getVerify(+id).catch(() => {
      navigate({ to: "/" });
    });
    contentsApi.getDetail(+id).then((res) => {
      if (res.success) setData(res.data);
    });
  }, [id, navigate]);

  if (!data) return;

  return (
    <>
      <div>
        <h2>{data.title}</h2>
        <p>
          <span style={{ textTransform: "capitalize" }}>
            {data.type.toLowerCase()}
          </span>
        </p>
        <article style={{ marginTop: 30 }}>
          <Editor editable={true} content={JSON.parse(data.body)} />
        </article>
      </div>
    </>
  );
};

export default EditTemplate;
