import { Editor } from "@tinymce/tinymce-react";

const TINYMCE_KEY = "5d69hqudzyhmoa0v09uej10bp1zghpplvbbciuekof9c15xw";

const RichTextEditor = ({ value, onChange, height = 200, ...props }) => (
  <Editor
    init={{
      height,
      menubar: false,
      branding: false,
      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
      ],
      toolbar: [
        "fullscreen | undo redo | image | code",
        "formatselect | bold italic backcolor link",
        "alignleft aligncenter alignright alignjustify",
        "bullist numlist outdent indent | help",
      ].join(" | "),
    }}
    apiKey={TINYMCE_KEY}
    value={value}
    onEditorChange={onChange}
    {...props}
  />
);

export default RichTextEditor;
