import { ReactFlowJsonObject } from "reactflow";

export default interface BaseExporter {
  export(graph: ReactFlowJsonObject): string;
}
