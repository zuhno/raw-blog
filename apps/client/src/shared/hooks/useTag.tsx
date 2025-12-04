import { useNavigate } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { LuX } from "react-icons/lu";

import { tagsApi } from "../apis";

interface IProps {
  editable: boolean;
}

const useTag = (props?: IProps) => {
  if (!props) props = { editable: true };
  const navigate = useNavigate();

  const [usedTags, setUsedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<{ id?: number; name: string }[]>([]);

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
        to: "/",
        search: { tagId },
      });
    },
    [navigate, props.editable]
  );

  const initTag = useCallback((tags: { id: number; name: string }[]) => {
    setTags(tags);
  }, []);

  useEffect(() => {
    tagsApi
      .getNameList()
      .then((res) => {
        if (res.success) setUsedTags(res.data);
      })
      .catch(() => {});
  }, []);

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
        <form onSubmit={onSubmitTag} autoComplete="off">
          <input id="tag" name="tag" list="usedTagList" type="text" />
          <datalist id="usedTagList">
            {usedTags.map((item, idx) => {
              return <option key={idx} value={item}></option>;
            })}
          </datalist>
          <button type="submit">Tag+</button>
        </form>
      );
    };
  }, [usedTags.length]);

  return {
    tagNames: tags.map((tag) => tag.name),
    initTag,
    TagForm,
    TagList,
  };
};

export default useTag;
