declare module "draft-js-alignment-plugin" {
  import { EditorPlugin } from "draft-js-plugins-editor";

  const createAlignmentPlugin: () => EditorPlugin;

  export default createAlignmentPlugin as any;
}
