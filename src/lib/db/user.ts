
import { TechStack, Plugin } from "~/app/types/building";
import dbConnect from "./mongodb";
import { UserProject } from "./models/user";

export async function saveUserProject(
  userEmail: string | null | undefined,
  repoName: string,
  techStack: TechStack,
  plugins: Plugin[]
) {
  if (!userEmail) {
    throw new Error("User email is required to save the project");
  }

  await dbConnect();

  const newProject = new UserProject({
    userEmail,
    repoName,
    techStack: {
      frameworkJS: techStack.frameworkJS,
      frameworkCSS: techStack.frameworkCSS,
      headless: techStack.headless,
      componentLib: techStack.componentLib,
    },
    plugins: plugins.map((plugin) => plugin.name),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    await newProject.save();
    console.log(`Project ${repoName} saved for user ${userEmail}`);
  } catch (error) {
    console.error("Error saving user project:", error);
    throw new Error("Failed to save user project");
  }
}
