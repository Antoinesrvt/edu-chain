// app/actions/createRepo.ts
"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "~/lib/authOptions";
import { Octokit } from "@octokit/rest";
import {
  TechStack,
  Plugin,
  ProjectFile,
  ITechItem,
  ScriptAction,
} from "~/app/types/building";
import dbConnect, { TechItem } from "~/lib/db/mongodb";
import { Session } from "next-auth";

interface ExtendedSession extends Session {
  accessToken?: string;
}

export async function createRepo(
  selectedBoilerplate: TechStack,
  selectedPlugins: Plugin[],
  repoName: string
) {
  const session = (await getServerSession(
    authOptions
  )) as ExtendedSession | null;
  if (!session || !session.accessToken) {
    throw new Error("Unauthorized or missing access token");
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      auto_init: true,
    });

    const techItems = await getTechItems(selectedBoilerplate, selectedPlugins);

    // Order of execution
    const executionOrder = [
      "frameworkJS",
      "frameworkCSS",
      "headless",
      "componentLib",
      "plugin",
    ];

    for (const itemType of executionOrder) {
      const items = techItems.filter((item) => item.type === itemType);
      for (const item of items) {
        await executeItemActions(item, octokit, repo.owner.login, repo.name);
      }
    }

    return { success: true, repoUrl: repo.html_url };
  } catch (error) {
    console.error("Error creating repository:", error);
    throw new Error("Failed to create repository");
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
    case "addFile":
      // This is handled separately in the executeItemActions function
      break;
    case "executeCommand":
      // Here you would execute a command on the repo
      // For now, we'll just log it as this would require additional setup
      console.log(`Executing command: ${action.payload}`);
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
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: file.path,
    message: `Add ${file.path}`,
    content: Buffer.from(file.content).toString("base64"),
  });
}
