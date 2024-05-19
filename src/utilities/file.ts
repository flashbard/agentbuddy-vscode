import { SaveDialogOptions, window } from "vscode";
import * as fs from "fs";

async function showSaveFileDialog(text: string) {
  const options: SaveDialogOptions = {
    title: "Save agentic workflow as crewAI Python script",
    filters: {
      "Python Files": ["py"],
      "All Files": ["*"],
    },
  };

  const result = await window.showSaveDialog(options);
  if (result) {
    const filePath = result.fsPath;
    fs.writeFileSync(filePath, text);
    console.log(`Selected file path: ${filePath}`);
    return filePath;
  } else {
    console.log("Save dialog canceled.");
  }
}

export { showSaveFileDialog };
