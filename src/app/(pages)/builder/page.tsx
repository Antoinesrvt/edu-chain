"use client"
import { useState } from 'react';
import * as Card from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import { css } from 'styled-system/css';
import { Center } from 'styled-system/jsx';
import {
  Plugin,
  TechStack,
} from "../../types/building";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createRepo } from '~/app/api/createRepo';
import { frameworksJS, frameworksCSS, headless, components } from '~/app/types/building';
import { Loader2 } from 'lucide-react';

import Step1Card from "./steps/step1";
import Step2Card from "./steps/step2";
import Step3Card from "./steps/step3";



export default function BuilderPage() {
  const [selectedBoilerplate, setSelectedBoilerplate] = useState<TechStack>();
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
         if (!selectedBoilerplate || !repoName) {
           setError("Please fill in all the fields");
           return;
         }
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
      console.log(result)
      if(result) {
        router.push(`/success?repoUrl=${encodeURIComponent(result.repoUrl)}`);
      }
    } catch (err: any) {
      if (err.message.includes("already exists")) {
        setError(
          `A repository named "${repoName}" already exists. Please choose a different name.`
        );
      } else {
        setError(err.message || "An unknown error occurred");
      }
    } finally {
      setIsCreating(false);
    }
  }


  function next() {
    console.log(steps)
    if (steps == 2) {
      handleCreateRepository();
    }
    setSteps(steps + 1);
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
      // case 1:
      //   return !selectedPlugins.length;
      case 2:
        return !repoName;
    }
  }


  return (
    <Center
      className={css({
        height: "100%",
        maxHeight: "90vh",
        maxWidth: "100vw",
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
        {steps === 2 && <Step3Card onChange={setRepoName} />}
        {steps === 3 && (
          <Card.Body
            className={css({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            })}
          >
            {error ? (
              <p>{error}</p>
            ) : (
              isCreating ?(
                <>
                  <Loader2
                    className={css({
                      animation: "spin 1s linear infinite",
                      marginBottom: "4",
                    })}
                    size={48}
                  />
                  <p>Creating your repository...</p>
                </>
              ) : (
                <p>Repository created successfully</p>
              )
            )}
          </Card.Body>
        )}
        <Card.Footer gap="3">
          <Button variant="outline" onClick={() => back()}>
            {steps === 0 || steps === 3 ? "Cancel" : "Back"}
          </Button>
          <Button
            display={steps !== 3 ? "" : "none"}
            disabled={nextDisabled()}
            onClick={() => next()}
          >
            {steps < 2 ? "Next" : "Generate"}
          </Button>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
}



