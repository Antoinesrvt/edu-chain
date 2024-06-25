"use client"
import { useState } from 'react';
import * as Card from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import { css } from 'styled-system/css';
import {
  Plugin,
  TechStack,
} from "../../types/building";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createRepo } from '~/app/api/createRepo';
import { frameworksJS, frameworksCSS, headless, components } from '~/app/types/building';

import Step1Card from "./steps/step1";
import Step2Card from "./steps/step2";
import Step3Card from "./steps/step3";



export default function BuilderPage() {
  const [selectedBoilerplate, setSelectedBoilerplate] = useState<TechStack>({
    frameworkJS: frameworksJS[0].value,
    frameworkCSS: frameworksCSS[0].value,
    headless: headless[0].value,
    componentLib: components[0].value,
  });
  const [selectedPlugins, setSelectedPlugins] = useState<Plugin[]>([]);
  const [steps, setSteps] = useState(0);

const [repoName, setRepoName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const { data: session } = useSession();
  const router = useRouter();

  function setPluginsSelected(plugin: Plugin) {
    const selectedPlugin = selectedPlugins.find((p) => p == plugin)
    if(selectedPlugin) {
      const newPlugins = selectedPlugins.filter((p) => p !== plugin);
      setSelectedPlugins([...newPlugins]);
      return;
    } 

    if(selectedPlugins.find((p) => p.family === plugin.family)) {
      const newPlugins = selectedPlugins.filter((p) => p.family !== plugin.family);
      setSelectedPlugins([...newPlugins, plugin]);
    } else {
      setSelectedPlugins([...selectedPlugins, plugin]);
    }
  }




  async function handleCreateRepository() {
    if (!session) {
      setError("You must be logged in to create a repository");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const result = await createRepo(
        selectedBoilerplate,
        selectedPlugins,
        repoName
      );
      router.push(`/success?repoUrl=${encodeURIComponent(result.repoUrl)}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsCreating(false);
    }
  }


  function next() {
    setSteps(steps + 1);
    if(steps == 3) {
      handleCreateRepository();
    }
  }

  function back() {
    if(steps > 0) {
      setSteps(steps - 1);
    } else {
      router.push("/");
    }
  }

  function nextDisabled() {
    switch(steps) {
      case 0:
        return !(selectedBoilerplate?.headless && selectedBoilerplate?.frameworkJS && selectedBoilerplate?.frameworkCSS && selectedBoilerplate?.componentLib);
      case 1:
        return !selectedPlugins.length;
      case 2:
        return !repoName;
    }
  }


  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      })}
    >
      <Card.Root width="md" height="lg">
        {steps === 0 && (
          <Step1Card
            selectedBoilerplate={selectedBoilerplate}
            setSelectedBoilerplate={setSelectedBoilerplate}
          />
        )}
        {steps === 1 && (
          <Step2Card onSelect={setPluginsSelected} selected={selectedPlugins} />
        )}
        {steps === 2 && (
          <Step3Card onChange={setRepoName} />
        )}
        <Card.Footer gap="3">
          <Button variant="outline" onClick={() => back()}>
            {steps === 0 ? "Cancel" : "Back"}
          </Button>
          <Button disabled={nextDisabled()} onClick={() => next()}>
            {steps < 3 ? "Next" : "Generate"}
          </Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}



