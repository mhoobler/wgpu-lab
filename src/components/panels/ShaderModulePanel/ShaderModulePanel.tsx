import { ChangeEvent, FC, useContext, useState } from "react";
import { Color } from "data";

import "./ShaderModulePanel.less";
import { NodeContext } from "components/NodeContext/NodeContext";

const type = "ShaderModule";
const ShaderModuleInit: NodeInitFn<GPUShaderModuleDescriptor, null> = (
  uuid,
  xyz
) => ({
  type,
  headerColor: new Color(255, 255, 0),
  uuid,
  size: [400, 600],
  xyz,
  body: {
    label: type,
    code: "",
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: null,
});

const ShaderModuleJson = (body: GPUShaderModuleDescriptor) => {
  const { label, code } = body;
  return { label, code }
}

type Props = PanelProps2<GPUShaderModuleDescriptor, null>;
const ShaderModulePanel: FC<Props> = ({ data }) => {
  const { dispatch } = useContext(NodeContext);
  const { uuid, body } = data;
  const [code, setCode] = useState<string>(body.code);

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = evt.currentTarget;
    body.code = value;
    setCode(body.code);
    dispatch({ type: "EDIT_NODE_BODY", payload: { uuid, body } });
  };

  return (
    <div className="input-container shader-module-descriptor">
      <textarea value={code} onChange={handleChange} spellCheck="false" />
    </div>
  );
};

export { ShaderModulePanel, ShaderModuleInit, ShaderModuleJson };
