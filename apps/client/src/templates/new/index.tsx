import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { contentsApi } from "../../shared/apis";
import useAccessToken from "../../shared/hooks/useAccessToken";
import useInput from "../../shared/hooks/useInput";
import useTag from "../../shared/hooks/useTag";
import useTiptapEditor from "../../shared/hooks/useTiptapEditor";
import useToggle from "../../shared/hooks/useToggle";
import useUploadImage from "../../shared/hooks/useUploadImage";

const NewTemplate = () => {
  const navigate = useNavigate();
  const { token } = useAccessToken();

  const [title, , onChangeTitle] = useInput();
  const [type, , onChangeType] = useInput<HTMLSelectElement>("POST");
  const [isPrivate, toggleIsPrivate] = useToggle();
  const [isPublish, toggleIsPublish] = useToggle();
  const [isPendingSave, toggleIsPendingSave] = useToggle(false);

  const { TiptapEditor, TiptapMenuBar, extractContent } = useTiptapEditor({
    editable: true,
  });
  const { tiptapContentUpload } = useUploadImage();
  const { tagNames, TagList, TagForm } = useTag();

  const availableSave = !isPendingSave && title !== "";

  const onSave = async () => {
    if (!availableSave) return;

    toggleIsPendingSave();
    try {
      let data = extractContent();
      data = await tiptapContentUpload(data).catch(() => null);
      if (!data) return;

      const res = await contentsApi.postCreate({
        title,
        body: JSON.stringify(data),
        private: isPrivate,
        publish: isPublish,
        type,
        tags: tagNames,
      });
      if (res.success) {
        navigate({
          to: "/detail/$id",
          params: { id: "" + res.data.id },
          replace: true,
        });
      }
    } finally {
      toggleIsPendingSave();
    }
  };

  useEffect(() => {
    const isLoggedIn = !!token;
    if (!isLoggedIn) navigate({ to: "/", replace: true });
  }, [token, navigate]);

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
          <button onClick={onSave} disabled={!availableSave}>
            {isPendingSave ? "Saving..." : "Save"}
          </button>
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

export default NewTemplate;
