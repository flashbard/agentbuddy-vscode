// import { ReactFlowJsonObject } from "reactflow";
// import BaseExporter from "./base";

// export default class CrewAiExporter implements BaseExporter {
//   private agents: Array<String> = [];

//   createImports() {
//     return `
//     import os
//     from crewai import Agent, Task, Crew, Process
//     from langchain_openai import ChatOpenAI
//         `;
//   }
//   createAgent(id: string, role: string, goal: string, llm: string): string {
//     const pythonCode = `
//       # Create an ${role} agent
//       agent_${this.agents.length} = Agent(
//           role="${role}",
//           goal="${goal}",
//           verbose=True,
//           llm="ChatOpenAI(model_name="${llm}", temperature=0.1)"
//       )
//       `;
    
//       this.agents.push(id);
//     return pythonCode;
//   }

//   export(graph: ReactFlowJsonObject): string {
//     throw new Error("Method not implemented.");
//   }
// }
