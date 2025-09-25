import TextAlign from "@tiptap/extension-text-align";
import {
  Editor,
  EditorContent,
  useEditor,
  useEditorState,
  generateHTML,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuCode,
  LuSquareCode,
  LuList,
  LuListOrdered,
  LuUndo,
  LuRedo,
  LuAlignRight,
  LuAlignJustify,
  LuAlignLeft,
  LuUnderline,
  LuLink,
  LuUnlink,
  LuImage,
  LuImageUp,
} from "react-icons/lu";
import sanitizeHtml from "sanitize-html";
import { ResizableImage } from "tiptap-extension-resizable-image";

import "tiptap-extension-resizable-image/styles.css";
import "./index.css";

interface IProps {
  editable: boolean;
}

const useTiptapEditor = (props?: IProps) => {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        link: {
          isAllowedUri: (url, ctx) =>
            ctx.defaultValidate(url) && /^https?:\/\//.test(url),
          shouldAutoLink: (url) => /^https?:\/\//.test(url),
          protocols: ["http", "https"],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ResizableImage.extend({
        selectable: props?.editable,
        draggable: props?.editable,
      }).configure({
        defaultWidth: 300,
        defaultHeight: Infinity,
        onUpload(file: File) {
          return new Promise((r) => {
            const src = URL.createObjectURL(file);
            return r({
              src,
              "data-keep-ratio": true,
            });
          });
        },
      }),
    ],
    [props?.editable]
  );

  const editor = useEditor({
    extensions,
    editable: props?.editable,
    autofocus: true,
  });

  const TiptapEditor = useMemo(() => {
    return () => {
      return <EditorContent editor={editor} tabIndex={-1} />;
    };
  }, [editor]);

  const TiptapMenuBar = useMemo(() => {
    return () => {
      return <MenuBar editor={editor} />;
    };
  }, [editor]);

  const parseToContent = useCallback(
    (data: string) => generateHTML(JSON.parse(data) as JSONContent, extensions),
    [extensions]
  );

  const cleanContent = useCallback(
    (data: string) =>
      sanitizeHtml(data, {
        allowedAttributes: false,
        allowedTags: [
          "p",
          "br",
          "span",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "s",
          "blockquote",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "code",
          "pre",
          "a",
          "img",
        ],
      }),
    []
  );

  const setContent = useCallback(
    (content: string) => {
      content = parseToContent(content);
      content = cleanContent(content);
      editor?.commands?.setContent(content);
    },
    [editor, parseToContent, cleanContent]
  );

  const extractContent = useCallback(() => {
    return editor?.getJSON();
  }, [editor]);

  return {
    TiptapEditor,
    TiptapMenuBar,
    setContent,
    extractContent,
  };
};

export default useTiptapEditor;

// Sub component
const MenuBar = ({ editor }: { editor: Editor }) => {
  const blobUrls = useRef<string[]>([]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor?.isActive("bold") ?? false,
        canBold: ctx.editor?.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor?.isActive("italic") ?? false,
        canItalic: ctx.editor?.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor?.isActive("strike") ?? false,
        canStrike: ctx.editor?.can().chain().toggleStrike().run() ?? false,
        isUnderline: ctx.editor?.isActive("underline") ?? false,
        canUnderline:
          ctx.editor?.can().chain().toggleUnderline().run() ?? false,
        isCode: ctx.editor?.isActive("code") ?? false,
        canCode: ctx.editor?.can().chain().toggleCode().run() ?? false,
        isCodeBlock: ctx.editor?.isActive("codeBlock") ?? false,
        isHeading1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor?.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor?.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor?.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor?.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
        isAlignLeft: ctx.editor?.isActive({ textAlign: "left" }) ?? false,
        isAlignCenter: ctx.editor?.isActive({ textAlign: "center" }) ?? false,
        isAlignRight: ctx.editor?.isActive({ textAlign: "right" }) ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        canLink: ctx.editor?.can().chain().toggleLink().run() ?? false,
        canUndo: ctx.editor?.can().chain().undo().run() ?? false,
        canRedo: ctx.editor?.can().chain().redo().run() ?? false,
      };
    },
  });

  const isActive = (is: boolean) =>
    is ? { background: "gray", color: "white" } : {};

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const imgRef = useRef<HTMLInputElement>(null);
  const addImage = (isExternal?: boolean) => {
    if (isExternal) {
      handleExternalImage();
    } else imgRef.current?.click();
  };

  const handleExternalImage = () => {
    const src = window.prompt("Image URL", "");
    if (!src) return;
    if (!/^https?:\/\//.test(src)) return;

    try {
      editor.commands.setResizableImage({ src, "data-keep-ratio": true });
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);
      editor.commands.setResizableImage({ src, "data-keep-ratio": true });
      blobUrls.current.push(src);
      event.target.value = "";
    }
  };

  useEffect(() => {
    const ref = blobUrls.current;
    return () => {
      ref.forEach((blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
    };
  }, []);

  return (
    <div>
      <input
        ref={imgRef}
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImage}
      />
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          style={isActive(editorState?.isHeading1)}
        >
          <LuHeading1 />
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          style={isActive(editorState?.isHeading2)}
        >
          <LuHeading2 />
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          style={isActive(editorState?.isHeading3)}
        >
          <LuHeading3 />
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 4 }).run()
          }
          style={isActive(editorState?.isHeading4)}
        >
          <LuHeading4 />
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 5 }).run()
          }
          style={isActive(editorState?.isHeading5)}
        >
          <LuHeading5 />
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 6 }).run()
          }
          style={isActive(editorState?.isHeading6)}
        >
          <LuHeading6 />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editorState?.canBold}
          style={isActive(editorState?.isBold)}
        >
          <LuBold />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editorState?.canItalic}
          style={isActive(editorState?.isItalic)}
        >
          <LuItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editorState?.canUnderline}
          style={isActive(editorState?.isUnderline)}
        >
          <LuUnderline />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editorState?.canStrike}
          style={isActive(editorState?.isStrike)}
        >
          <LuStrikethrough />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCode().run()}
          disabled={!editorState?.canCode}
          style={isActive(editorState?.isCode)}
        >
          <LuCode />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          style={isActive(editorState?.isCodeBlock)}
        >
          <LuSquareCode />
        </button>
        <button onClick={() => addImage()}>
          <LuImageUp />
        </button>
        <button onClick={() => addImage(true)}>
          <LuImage />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          style={isActive(editorState?.isBulletList)}
        >
          <LuList />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          style={isActive(editorState?.isOrderedList)}
        >
          <LuListOrdered />
        </button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          style={isActive(editorState.isAlignLeft)}
        >
          <LuAlignLeft />
        </button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          style={isActive(editorState.isAlignCenter)}
        >
          <LuAlignJustify />
        </button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          style={isActive(editorState.isAlignRight)}
        >
          <LuAlignRight />
        </button>
        <button
          onClick={setLink}
          disabled={!editorState?.canLink}
          style={isActive(editorState.isLink)}
        >
          <LuLink />
        </button>
        <button
          onClick={() => editor?.chain().unsetLink().run()}
          disabled={!editorState.isLink}
        >
          <LuUnlink />
        </button>
        <button
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editorState?.canUndo}
        >
          <LuUndo />
        </button>
        <button
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editorState?.canRedo}
        >
          <LuRedo />
        </button>
      </div>
    </div>
  );
};
