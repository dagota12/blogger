import Quill, { Delta, Op } from "quill";
import { RefObject, useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Button from "./Button";
import Input from "./Input";
import { SendIcon } from "lucide-react";
interface Props {
  onSubmit: (title: string, body: string) => void;
  onCancle: () => void;
  innerRef?: RefObject<Quill | null>;
  placeholder?: string;
  defaultTitle?: string;
  loading?: boolean;
  defaultvalue: Delta | Op[];
  variant: "submit" | "update";
}
const Editor = ({
  variant,
  placeholder,
  defaultTitle = "",
  onSubmit,
  onCancle,
  loading,
  defaultvalue,
  innerRef,
}: Props) => {
  const [data, setData] = useState({
    title: defaultTitle,
    body: JSON.stringify(defaultvalue),
  });

  const quillRef = useRef<Quill>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const quill = new Quill(editorContainer, {
      theme: "snow",
      placeholder,
      readOnly: loading,
    });

    quillRef.current = quill;
    quill.focus();
    quill.setContents(defaultvalue);

    // setData((prev) => ({ ...prev, title: quill.getText() }));
    if (innerRef) {
      innerRef.current = quill;
    }

    quill.on("text-change", () => {
      setData((prev) => ({
        ...prev,
        body: JSON.stringify(quill.getContents()),
      }));
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) container.innerHTML = "";
      if (quillRef.current) quillRef.current = null;
    };
  }, [innerRef]);
  return (
    <div className="w-full bg-slate-700 h-fit rounded-md p-3">
      <Input
        label="title"
        value={data.title}
        className="bg-slate-200 text-zinc-700"
        onChange={(e) =>
          setData((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <div id="editor" className="border-none" ref={containerRef}></div>
      <div className="w-full flex mt-4 px-2">
        <Button
          disabled={loading}
          icon={<SendIcon className="mr-2 size-4" />}
          className="bg-slate-800"
          onClick={() => {
            onSubmit(data.title, data.body);
          }}
        >
          share
        </Button>
        {variant === "update" && (
          <Button
            onClick={() => {
              onCancle();
            }}
          >
            cancle
          </Button>
        )}
      </div>
    </div>
  );
};

export default Editor;
