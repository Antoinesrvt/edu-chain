import { Octokit } from "@octokit/rest";
import { TechStack, Plugin } from "~/app/types/building";

async function setupTechStack(octokit: Octokit, owner: string, repo: string, techStack: TechStack, plugins: Plugin[]) {
  // Create package.json
  await createPackageJson(octokit, owner, repo, techStack, plugins);

  // Create configuration files
  await createConfigFiles(octokit, owner, repo, techStack, plugins);

  // Create basic project structure
  await createProjectStructure(octokit, owner, repo, techStack);

  // Setup plugins
  for (const plugin of plugins) {
    await setupPlugin(octokit, owner, repo, plugin);
  }
}

async function createPackageJson(octokit: Octokit, owner: string, repo: string, techStack: TechStack, plugins: Plugin[]) {
  const packageJson = {
    name: repo,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      [techStack.frameworkJS]: 'latest',
      [techStack.frameworkCSS]: 'latest',
      [techStack.headless]: 'latest',
      [techStack.componentLib]: 'latest',
      // Add other dependencies based on plugins
    },
    devDependencies: {
      typescript: '^4.9.5',
      '@types/react': '^18.0.28',
      '@types/node': '^18.15.0'
    }
  };

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'package.json',
    message: 'Initial package.json',
    content: Buffer.from(JSON.stringify(packageJson, null, 2)).toString('base64'),
  });
}

async function createConfigFiles(octokit: Octokit, owner: string, repo: string, techStack: TechStack, plugins: Plugin[]) {
  // Create tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'node',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
    exclude: ['node_modules']
  };

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'tsconfig.json',
    message: 'Add tsconfig.json',
    content: Buffer.from(JSON.stringify(tsconfig, null, 2)).toString('base64'),
  });

  // Create next.config.js
  const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
  `.trim();

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'next.config.js',
    message: 'Add next.config.js',
    content: Buffer.from(nextConfig).toString('base64'),
  });

  // Add configuration for CSS framework if needed
  if (techStack.frameworkCSS === 'tailwindcss') {
    const tailwindConfig = `
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
    `.trim();

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'tailwind.config.js',
      message: 'Add tailwind.config.js',
      content: Buffer.from(tailwindConfig).toString('base64'),
    });
  }

  // Add configurations for other frameworks/libraries as needed
}

async function createProjectStructure(octokit: Octokit, owner: string, repo: string, techStack: TechStack) {
  // Create pages directory and index.tsx
  const indexContent = `
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div>
      <h1>Welcome to your new Next.js project!</h1>
    </div>
  )
}

export default Home
  `.trim();

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'pages/index.tsx',
    message: 'Add initial index.tsx',
    content: Buffer.from(indexContent).toString('base64'),
  });

  // Create _app.tsx
  const appContent = `
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
  `.trim();

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'pages/_app.tsx',
    message: 'Add _app.tsx',
    content: Buffer.from(appContent).toString('base64'),
  });

  // Add more files as needed for the project structure
}

async function setupPlugin(octokit: Octokit, owner: string, repo: string, plugin: Plugin) {
  // Implement plugin-specific setup
  // This could involve adding configuration files, modifying existing files, etc.
  console.log(`Setting up plugin: ${plugin.name}`);
}
