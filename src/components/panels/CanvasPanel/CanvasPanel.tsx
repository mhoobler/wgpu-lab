import { Color } from "data";
import { FC, useContext, useEffect, useRef } from "react";
import {WgpuContext} from "wgpu";

const type = "CanvasPanel";
const CanvasPanelInit: NodeInitFn<GPUCanvasPanel> = (uuid, xyz) => ({
  type,
  headerColor: new Color(255, 255, 255),
  uuid,
  size: [200, 200],
  xyz,
  body: {
    label: type,
    canvas: null,
    ctx: null,
    createView: null
  },
  sender: {
    uuid,
    type,
    value: null,
    to: new Set(),
  },
  receivers: null,
});

type Props = PanelProps<GPUCanvasPanel>;
const CanvasPanel: FC<Props> = ({ body }) => {
  const { device, format } = useContext(WgpuContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && !body.canvas) {
      const ctx = canvasRef.current.getContext("webgpu");
      ctx.configure({
        device: device,
        format: format,
      });
      body.canvas = canvasRef.current;
      body.ctx = ctx;
      body.createView = () => ctx.getCurrentTexture().createView();
    }
  }, [body]);

  return (
    <div className="input-container">
      <canvas ref={canvasRef} width={142} height={170}></canvas>
    </div>
  );
};

export { CanvasPanel, CanvasPanelInit };
