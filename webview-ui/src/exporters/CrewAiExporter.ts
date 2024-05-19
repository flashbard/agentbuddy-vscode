// A bad implementation, will work on it...

import { ReactFlowJsonObject } from "reactflow";
import BaseExporter from "./BaseExporter";

type Agent = {
  id: string;
  role: string;
  goal: string;
  llm: string;
  allowDelegation: "True" | "False";
};

type Task = {
  id: string;
  description: string;
  outcome: string;
  agent: string;
};

type EntityVar = {
  id: string;
  var: string;
};

export default class CrewAiExporter implements BaseExporter {
  private agents: Array<Agent> = [];
  private agentsToVars: Array<EntityVar> = [];

  private tasks: Array<Task> = [];
  private tasksToVars: Array<EntityVar> = [];

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
      `${agentVarName} = Agent(`,
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

  createTask(task: Task, index: number): string {
    const taskVarName = `task_${index}`;
    const agentForTask = this.getAgentById(task.agent);
    let agentVarName;
    if (agentForTask) {
      agentVarName = this.getAgentVarsById(agentForTask.id)?.var;
      if (agentVarName === undefined) {
        agentVarName = "None";
      }
    }
    const code = [
      `${taskVarName} = Task(`,
      `    description="${task.description}"`,
      `    expected_output="${task.outcome}"`,
      `    agent=${agentVarName}`,
      `)`,
    ].join("\n");
    this.tasksToVars.push({ id: task.id, var: taskVarName });
    return code;
  }

  createCrew(): string {
    return [
      `crew = Crew(`,
      `    agents=[${this.agentsToVars.map((a) => a.var)}]`,
      `    tasks=[${this.tasksToVars.map((t) => t.var)}]`,
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

  createManyTasks(): string {
    const tasksCode = [];
    let index = 0;
    for (const task of this.tasks) {
      index += 1;
      const code = this.createTask(task, index);
      tasksCode.push(code);
    }
    return tasksCode.join("\n");
  }

  loadAgentsFromGraph(): void {
    this.graph.nodes.forEach((element) => {
      if (element.type === "agent") {
        this.agents.push({
          id: element.id,
          role: element.data.role,
          goal: element.data.goal,
          llm: element.data.llm,
          allowDelegation: "False",
        });
      }
    });
  }

  loadTasksFromGraph(): void {
    this.graph.nodes.forEach((element) => {
      if (element.type === "task") {
        this.tasks.push({
          id: element.id,
          description: element.data.description,
          outcome: element.data.outcome,
          agent: "None",
        });
      }
    });
  }

  getAgentById(id: string): Agent | undefined {
    return this.agents.find((a) => a.id === id);
  }

  getAgentVarsById(id: string): EntityVar | undefined {
    return this.agentsToVars.find((a) => a.id === id);
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id == id);
  }

  loadEdgesFromGraph(): void {
    this.graph.edges.forEach((edge) => {
      // Poor handling, improve later
      let source: any = undefined;
      let sourceType = "";
      if (edge.sourceHandle) {
        if (edge.sourceHandle === "taskOut") {
          source = this.getTaskById(edge.source);
          sourceType = "task";
        } else {
          source = this.getAgentById(edge.source);
          sourceType = "agent";
        }
      }

      // Target will never be a Task
      let target: any = undefined;
      let targetType = "agent";
      if (edge.targetHandle) {
        target = this.getAgentById(edge.target);
      }

      if (sourceType === "agent") {
        source.allowDelegation = "True";
        target.allowDelegation = "True";
      }

      if (sourceType === "task") {
        source.agent = target.id;
      }
    });
  }

  export(): string {
    console.log(this.graph);
    this.loadAgentsFromGraph();
    this.loadTasksFromGraph();
    this.loadEdgesFromGraph();
    const code = [
      this.createImports(),
      this.createManyAgents(),
      this.createManyTasks(),
      this.createCrew(),
    ].join("\n");
    return code;
  }
}
