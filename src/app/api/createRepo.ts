// app/actions/createRepo.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "~/lib/authOptions";
import { Octokit } from "@octokit/rest";
import {
  TechStack,
  Plugin,
  ProjectFile,
} from "~/app/types/building";
import { ITechItem, ScriptAction } from "~/app/types/server";
import dbConnect, { TechItem } from "~/lib/db/mongodb";
import { Session } from "next-auth";
import { saveUserProject } from "~/lib/db/user";

interface ExtendedSession extends Session {
  accessToken?: string;
}

export async function createRepo(
  selectedBoilerplate: TechStack,
  selectedPlugins: Plugin[],
  repoName: string
) {
  const session = await getServerSession(authOptions)
  console.log(session)
  if (!session || !session.accessToken) {
    throw new Error("Unauthorized or missing access token");
  }

  const octokit = new Octokit({ auth: session.accessToken });


try {
      await octokit.repos.get({
        owner: session.user?.name || '',
        repo: repoName,
      });
      // If we get here, the repo exists
      throw new Error(`Repository "${repoName}" already exists`);
    } catch (error: any) {
      if (error.status !== 404) {
        // If the error is not a 404 (Not Found), rethrow it
        throw error;
      }
      // If it's a 404, the repo doesn't exist, so we can create it
    }

  try {

    // Create the repository on Github
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      auto_init: true,
    });

    // Get the tech items from the database
    const techItems = await getTechItems(selectedBoilerplate, selectedPlugins);

    // Order of execution
    const executionOrder = [
      "frameworkJS",
      "frameworkCSS",
      "headless",
      "componentLib",
      "plugin",
    ];

    // Execute the actions for each tech item => Setup project structure
    for (const itemType of executionOrder) {
      const items = techItems.filter((item) => item.type === itemType);
      for (const item of items) {
        await executeItemActions(item, octokit, repo.owner.login, repo.name);
      }
    }

    // Save the project to the database
    await saveUserProject(
      session.user?.email,
      repoName,
      selectedBoilerplate,
      selectedPlugins
    );

    return { success: true, repoUrl: repo.html_url };
  } catch (error: any) {
    console.error("Error creating repository:", error);
    if (error.status === 422 && error.message.includes("name already exists")) {
      throw new Error(`Repository "${repoName}" already exists`);
    }
}
}

async function getTechItems(
  boilerplate: TechStack,
  plugins: Plugin[]
): Promise<ITechItem[]> {
  await dbConnect();

  const techItemNames = [
    boilerplate.frameworkJS,
    boilerplate.frameworkCSS,
    boilerplate.headless,
    boilerplate.componentLib,
    ...plugins.map((p) => p.name),
  ];

  return TechItem.find({ name: { $in: techItemNames } });
}

async function executeItemActions(
  item: ITechItem,
  octokit: Octokit,
  owner: string,
  repo: string
) {
  for (const action of item.actions) {
    await executeAction(action, octokit, owner, repo);
  }

  for (const file of item.files) {
    await addFileToRepo(file, octokit, owner, repo);
  }
}

async function executeAction(
  action: ScriptAction,
  octokit: Octokit,
  owner: string,
  repo: string
) {
  switch (action.type) {
    case "install":
      await updatePackageJson(octokit, owner, repo, action.payload);
      break;
    case "executeCommand":
      await executeCommandOnRepo(octokit, owner, repo, action.payload);
      break;
  }
}

async function updatePackageJson(
  octokit: Octokit,
  owner: string,
  repo: string,
  dependency: string
) {
  // Fetch current package.json
  const { data: packageJson } = await octokit.repos.getContent({
    owner,
    repo,
    path: "package.json",
  });

  if ("content" in packageJson) {
    const content = Buffer.from(packageJson.content, "base64").toString(
      "utf-8"
    );
    const pkg = JSON.parse(content);

    // Add new dependency
    if (!pkg.dependencies) {
      pkg.dependencies = {};
    }
    pkg.dependencies[dependency.split("@")[0]] =
      dependency.split("@")[1] || "latest";

    // Update package.json in the repo
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: "package.json",
      message: `Add ${dependency} to dependencies`,
      content: Buffer.from(JSON.stringify(pkg, null, 2)).toString("base64"),
      sha: packageJson.sha,
    });
  }
}

async function addFileToRepo(
  file: ProjectFile,
  octokit: Octokit,
  owner: string,
  repo: string
) {
  try {
    // Check if file already exists
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
      });
      console.log(`File ${file.path} already exists in ${owner}/${repo}. Updating...`);
    } catch (error: any) {
      if (error.status !== 404) throw error;
      // If we get here, the file doesn't exist, which is fine
    }

    // Create or update the file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: file.path,
      message: `Add or update ${file.path}`,
      content: Buffer.from(file.content).toString("base64"),
    });
    console.log(`File ${file.path} added/updated successfully in ${owner}/${repo}`);
  } catch (error) {
    console.error(`Error adding/updating file ${file.path} in ${owner}/${repo}:`, error);
    throw error;
  }
}


async function executeCommandOnRepo(
  octokit: Octokit,
  owner: string,
  repo: string,
  command: string
) {
  // GitHub API doesn't provide a direct way to execute commands on a repository.
  // Instead, we'll create a GitHub Actions workflow file that executes the command.
  const workflowContent = `
name: Execute Command
on: [workflow_dispatch]
jobs:
  execute-command:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Execute Command
      run: ${command}
  `;

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: ".github/workflows/execute-command.yml",
      message: "Add workflow to execute command",
      content: Buffer.from(workflowContent).toString("base64"),
    });
    console.log(
      `Workflow to execute command "${command}" added to ${owner}/${repo}`
    );

    // Trigger the workflow
    await octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: "execute-command.yml",
      ref: "main", // or whichever branch you want to run this on
    });
    console.log(
      `Workflow to execute command "${command}" triggered in ${owner}/${repo}`
    );
  } catch (error) {
    console.error(
      `Error executing command "${command}" in ${owner}/${repo}:`,
      error
    );
  }
}