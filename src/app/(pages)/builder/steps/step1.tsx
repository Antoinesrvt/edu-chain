import React from 'react'
import { useState } from 'react';
import * as Card from "~/components/ui/card";
import * as Select from "~/components/ui/select";
import {Button} from "~/components/ui/button";
import {Heading} from "~/components/ui/heading";
import { Stack, HStack } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { Code } from '~/components/ui/code';
import {
  frameworksJS,
  headless,
  frameworksCSS,
  components,
  TechStack,
} from "../../../types/building";
import { SelectComp } from "@components/UI/select";
import { frameworkJS, frameworkCSS, headlessLib, componentLib } from "../../../types/building";

type Props = {
  selectedBoilerplate: TechStack;
  setSelectedBoilerplate: (boilerplate: TechStack) => void;
}

function Step1Card({selectedBoilerplate, setSelectedBoilerplate}: Props) {
  return (
    <>
      <Card.Header>
        <Card.Title>Select a Boilerplate</Card.Title>
      </Card.Header>
      <Card.Body>
        <Stack gap="4">
          <div>
            <Heading className={css({ pt: "10px", pb: "6px" })}>
              Main stack:
            </Heading>
            <HStack gap="4">
              <SelectComp
                label="Framework"
                items={frameworksJS}
                value={selectedBoilerplate?.frameworkJS}
                onSelect={(item: string) =>
                  setSelectedBoilerplate({
                    frameworkCSS: selectedBoilerplate?.frameworkCSS || "",
                    frameworkJS: item as frameworkJS,
                    headless: selectedBoilerplate?.headless || "",
                    componentLib: selectedBoilerplate?.componentLib || "",
                  })
                }
              />
              <SelectComp
                label="CSS framework"
                items={frameworksCSS}
                value={selectedBoilerplate?.frameworkCSS}
                onSelect={(item: string) =>
                  setSelectedBoilerplate({
                    frameworkCSS: item as frameworkCSS,
                    frameworkJS: selectedBoilerplate?.frameworkJS || "",
                    headless: selectedBoilerplate?.headless || "",
                    componentLib: selectedBoilerplate?.componentLib || "",
                  })
                }
              />
            </HStack>
          </div>
          <div className={css({ pb: "18px" })}>
            <Heading className={css({ pt: "10px", pb: "6px" })}>
              Components / UI: :
            </Heading>
            <HStack gap="4">
              <SelectComp
                label="Headless Component"
                items={headless}
                value={selectedBoilerplate?.headless}
                onSelect={(item: string) =>
                  setSelectedBoilerplate({
                    frameworkCSS: selectedBoilerplate?.frameworkCSS || "",
                    frameworkJS: selectedBoilerplate?.frameworkJS || "",
                    headless: item as headlessLib,
                    componentLib: selectedBoilerplate?.componentLib || "",
                  })
                }
              />

              <SelectComp
                label="Component library"
                items={components}
                value={selectedBoilerplate?.componentLib}
                onSelect={(item: string) =>
                  setSelectedBoilerplate({
                    frameworkCSS: selectedBoilerplate?.frameworkCSS || "",
                    frameworkJS: selectedBoilerplate?.frameworkJS || "",
                    headless: selectedBoilerplate?.headless || "",
                    componentLib: item as componentLib,
                  })
                }
              />
            </HStack>
          </div>
          {selectedBoilerplate && (
            <HStack gap="4">
              <Heading>Tech stack:</Heading>
              <Code background="lightblue" color="white">
                {selectedBoilerplate.frameworkJS}
              </Code>
              <Code background="lightseagreen" color="white">
                {selectedBoilerplate.frameworkCSS}
              </Code>
              <Code background="gray.emphasized" color="white">
                {selectedBoilerplate.headless}
              </Code>
              <Code background="green" color="white">
                {selectedBoilerplate.componentLib}
              </Code>
            </HStack>
          )}
        </Stack>
      </Card.Body>
    </>
  );
}

export default Step1Card