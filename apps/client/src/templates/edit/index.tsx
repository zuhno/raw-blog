import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";

import { contentsApi } from "../../shared/apis";
import useInput from "../../shared/hooks/useInput";
import useTag from "../../shared/hooks/useTag";
import useTiptapEditor from "../../shared/hooks/useTiptapEditor";
import useToggle from "../../shared/hooks/useToggle";
import useUploadImage from "../../shared/hooks/useUploadImage";

const EditTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });

  const [title, setTitle, onChangeTitle] = useInput();
  const [type, setType, onChangeType] = useInput<HTMLSelectElement>("POST");
  const [isPrivate, toggleIsPrivate] = useToggle();
  const [isPublish, toggleIsPublish] = useToggle();

  const { TiptapEditor, TiptapMenuBar, setContent, extractContent } =
    useTiptapEditor({ editable: true });
  const { tiptapContentUpload } = useUploadImage();
  const { tagNames, initTag, TagList, TagForm } = useTag();

  const onSave = async () => {
    let data = extractContent();
    data = await tiptapContentUpload(data).catch(() => null);
    if (!data) return;

    const res = await contentsApi.patchUpdate(+id!, {
      title,
      body: JSON.stringify(data),
      private: isPrivate,
      publish: isPublish,
      type,
      tags: tagNames,
    });
    if (res.success) {
      navigate({ to: "/detail/$id", params: { id: id! }, replace: true });
    }
  };

  useEffect(() => {
    if (!id) return;
    contentsApi
      .getVerify(+id)
      .then(() => {
        contentsApi.getDetail(+id).then((res) => {
          if (res.success) {
            setTitle(res.data.title);
            setType(res.data.type);
            setContent(res.data.body);
            if (res.data.private) toggleIsPrivate();
            if (res.data.publish) toggleIsPublish();
            if (res.data.tags.length)
              initTag({ tags: res.data.tags, type: res.data.type });
          }
        });
      })
      .catch(() => {
        navigate({ to: "/" });
      });
  }, [
    id,
    navigate,
    setContent,
    setTitle,
    setType,
    toggleIsPrivate,
    toggleIsPublish,
    initTag,
  ]);

  if (!title) return;

  return (
    <>
      <div>
        <input
          id="title"
          type="text"
          value={title}
          onChange={onChangeTitle}
          style={{
            width: "70%",
            fontSize: "2em",
            fontWeight: "bold",
            padding: "5px 10px",
          }}
        />
        <p>
          <input
            id="private"
            type="checkbox"
            checked={isPrivate}
            onChange={toggleIsPrivate}
          />
          <label htmlFor="private">Private</label>
          {" | "}
          <input
            id="publish"
            type="checkbox"
            checked={isPublish}
            onChange={toggleIsPublish}
          />
          <label htmlFor="publish">Publish</label>
          {" | "}
          <select id="type" value={type} onChange={onChangeType}>
            <option value="POST">Post</option>
            <option value="DAILY">Daily</option>
          </select>
          {" | "}
          <button onClick={onSave}>Save</button>
        </p>
        <TagList />
        <TagForm />
        <br />
        <article>
          <TiptapMenuBar />
          <hr />
          <TiptapEditor />
        </article>
      </div>
    </>
  );
};

export default EditTemplate;
