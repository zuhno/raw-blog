import { EditorContent, useEditor, type Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface IProps {
  editable: boolean;
  content: Content;
}

const Editor = ({ editable, content }: IProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    editable,
    content,
  });

  return <EditorContent editor={editor} />;
};

export default Editor;
