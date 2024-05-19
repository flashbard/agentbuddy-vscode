import { commands, ExtensionContext } from "vscode";
import { ABPlayground } from "./panels/ABPlayground";

export function activate(context: ExtensionContext) {
  const showHelloWorldCommand = commands.registerCommand("agentbuddy.playground", () => {
    ABPlayground.render(context.extensionUri);
  });

  context.subscriptions.push(showHelloWorldCommand);
}
