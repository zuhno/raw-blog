import { useCallback, useMemo, useState, type FormEvent } from "react";
import { LuX } from "react-icons/lu";

interface IProps {
  editable: boolean;
}

const useTag = (props?: IProps) => {
  if (!props) props = { editable: true };
  const [tags, setTags] = useState<string[]>([]);

  const onSubmitTag = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    let newTag = formData.get("tag") as string;
    if (!newTag) return;
    newTag = newTag.toLowerCase().trim().replace(/\s+/g, "-");
    setTags((prev) => {
      if (prev.includes(newTag)) return prev;
      else return [...prev, newTag];
    });
    target.reset();
  };

  const onDeleteTag = (tag: string) => {
    setTags((prev) => {
      if (prev.includes(tag)) return prev.filter((item) => item !== tag);
      else return prev;
    });
  };

  const initTag = useCallback((tags: string[]) => {
    setTags(tags);
  }, []);

  const TagList = useMemo(() => {
    return () => {
      return (
        <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {tags.map((tag) => {
            return (
              <span key={tag}>
                {tag}
                {props?.editable && (
                  <button
                    style={{ marginLeft: 3 }}
                    onClick={() => onDeleteTag(tag)}
                  >
                    <LuX />
                  </button>
                )}
              </span>
            );
          })}
        </p>
      );
    };
  }, [tags, props?.editable]);

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

  return { tags, initTag, TagForm, TagList };
};

export default useTag;
