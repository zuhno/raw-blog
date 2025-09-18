import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { LuX } from "react-icons/lu";

interface IProps {
  editable: boolean;
}

const useTag = (props?: IProps) => {
  if (!props) props = { editable: true };

  const navigate = useNavigate();
  const [tags, setTags] = useState<{ id?: number; name: string }[]>([]);
  const [type, setType] = useState("POST");

  const onSubmitTag = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    let newTag = formData.get("tag") as string;
    newTag = newTag.toLowerCase().trim().replace(/\s+/g, "-");
    if (!newTag) {
      target.reset();
      return;
    }
    setTags((prev) => {
      const hasTag = prev.some((item) => item.name === newTag);
      if (hasTag) return prev;
      else return [...prev, { name: newTag }];
    });
    target.reset();
  };

  const onDeleteTag = (tag: string) => {
    setTags((prev) => {
      const hasTag = prev.some((item) => item.name === tag);
      if (hasTag) return prev.filter((item) => item.name !== tag);
      else return prev;
    });
  };

  const toListByTag = useCallback(
    (tagId?: number) => {
      if (props.editable || tagId === undefined) return;
      navigate({
        to: type === "POST" ? "/" : "/daily",
        search: { tagId },
      });
    },
    [navigate, props.editable, type]
  );

  const initTag = useCallback(
    ({
      tags,
      type,
    }: {
      tags: { id: number; name: string }[];
      type: string;
    }) => {
      setTags(tags);
      setType(type);
    },
    []
  );

  const TagList = useMemo(() => {
    return () => {
      if (!tags.length) return null;
      return (
        <p
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span>Tags: </span>
          {tags.map((tag) => {
            return (
              <button key={tag.name} onClick={() => toListByTag(tag.id)}>
                {tag.name}
                {props?.editable && (
                  <LuX
                    onClick={() => onDeleteTag(tag.name)}
                    style={{ marginLeft: 3 }}
                  />
                )}
              </button>
            );
          })}
        </p>
      );
    };
  }, [tags, props?.editable, toListByTag]);

  const TagForm = useMemo(() => {
    return () => {
      return (
        <form onSubmit={onSubmitTag}>
          <input id="tag" name="tag" type="text" />
          <button type="submit">Tag+</button>
        </form>
      );
    };
  }, []);

  return {
    tagNames: tags.map((tag) => tag.name),
    initTag,
    TagForm,
    TagList,
  };
};

export default useTag;
