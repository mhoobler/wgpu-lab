type DefaultProps = { children: React.ReactNode };
type n = number;

type GPUBase = GPUObjectBase | GPUObjectDescriptorBase | GPUPipelineBase | GPUPipelineDescriptorBase;

type WgpuContextState = {
  device?: GPUDevice;
  format?: GPUTextureFormat;
  adapter?: GPUAdapter;
  error?: Error;
};

interface GPUCanvasPanel {
  label: string;
  canvas: HTMLCanvasElement;
  ctx: GPUCanvasContext;
}

interface GPURenderPassDescriptorEXT extends GPURenderPassDescriptor {
  createView: (() => GPUTextureView) | null
}

interface GPUCommandEncoderDescriptorEXT extends GPUObjectDescriptorBase {
  renderPassDesc: GPURenderPassDescriptorEXT
  drawCall: GPUDrawCall[];
}

interface GPUDrawCall extends GPUObjectBase {
  commandEncoderDesc: GPUCommandEncoderDescriptorEXT
  renderPipeline?: GPURenderPipeline;
  vertexCount: number;
  instanceCount?: number;
  firstVertex?: number;
  firstInstance?: number;
}

type PanelProps<T> = {
  body: T;
  uuid: string;
  children: React.ReactNode;
};

interface IColor {
  xyzw: [n, n, n, n];
  hexString: () => string;
  rgbaString: () => string;
}

type NodeTypes = [
  "ShaderModule",
  "VertexState",
  "FragmentState",
  "CanvasPanel",
  "RenderPipeline",
  "RenderPass",
  "CommandEncoder",
  "DrawCall",
];

type NodeType = NodeTypes[number];

type NodeSender = {
  uuid: string,
  type: NodeType,
  value: GPUBase,
  to: Set<NodeData<GPUBase>>
};

type NodeReceiver = {
  uuid: string;
  type: NodeType;
  from: NodeData<GPUBase> | null;
}

type NodeConnection = {
  sender: {
    uuid: string;
    xyz: [n, n, n];
  };
  receiver: {
    type: string;
    uuid: string;
    xyz: [n, n, n];
  };
};
type ConnectionMap = Map<NodeData<GPUBase>, Map<NodeData<GPUBase>, number>>;

interface NodeBase {
  uuid: string,
  type: NodeType,
  headerColor: IColor,
  xyz: [n, n, n]
  size: [n, n]
}
interface NodeData<T> extends NodeBase {
  body: T;
  sender: NodeSender;
  receivers: NodeReceiver[];
}

type NodeInitFn<T> = (uuid: string, xyz: [n, n, n]) => NodeData<T>;
