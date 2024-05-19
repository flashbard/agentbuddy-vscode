import { ReactFlowJsonObject } from "reactflow";
import BaseExporter from "./BaseExporter";

type Agent = {
  id: string;
  role: string;
  goal: string;
  llm: string;
  allowDelegation: boolean;
};

type AgentVar = {
  id: string;
  var: string;
};

export default class CrewAiExporter implements BaseExporter {
  private agents: Array<Agent> = [];
  private agentsToVars: Array<AgentVar> = [];
  private graph: ReactFlowJsonObject;

  constructor(graph: ReactFlowJsonObject) {
    this.graph = graph;
  }

  createImports(): string {
    return [
      "import os",
      "from crewai import Agent, Task, Crew, Process",
      "from langchain_openai import ChatOpenAI",
    ].join("\n");
  }

  createAgent(agent: Agent, index: number): string {
    const agentVarName = `agent_${index}`;
    const code = [
      "${agentVarName} = Agent(",
      `    role="${agent.role}`,
      `    goal="${agent.goal}`,
      `    verbose=True`,
      `    llm="ChatOpenAI(model_name="${agent.llm}", temperature=0.1)`,
      `    allowDelegation=${agent.allowDelegation}`,
      `)`,
    ].join("\n");
    this.agentsToVars.push({ id: agent.id, var: agentVarName });
    return code;
  }

  createCrew(): string {
    return [
      `crew = Crew(`,
      `    agents=[${this.agentsToVars.map((a) => a.var)}]`,
      `    verbose=2`,
      `)`,
    ].join("\n");
  }

  createManyAgents(): string {
    const agentsCode = [];
    let index = 0;
    for (const agent of this.agents) {
      index += 1;
      const code = this.createAgent(agent, index);
      agentsCode.push(code);
    }
    return agentsCode.join("\n");
  }

  loadAgentsFromGraph(): void {
    this.graph.nodes.forEach((element) => {
      if (element.type === "agent") {
        this.agents.push({
          id: element.id,
          role: element.data.role,
          goal: element.data.goal,
          llm: element.data.llm,
          allowDelegation: false,
        });
      }
    });
  }

  export(): string {
    this.loadAgentsFromGraph();
    const code = [this.createImports(), this.createManyAgents(), this.createCrew()].join("\n");
    return code;
  }
}
