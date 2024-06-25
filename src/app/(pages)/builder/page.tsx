"use client"
import { useState } from 'react';
import * as Card from "~/components/ui/card";
import * as Select from "~/components/ui/select";
import {Button} from "~/components/ui/button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {Heading} from "~/components/ui/heading";
import { Stack, HStack } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { Code } from '~/components/ui/code';

type SelectItem = {
  label: string;
  value: string;
  disabled?: boolean;
}


export default function BuilderPage() {
  const [selectedBoilerplate, setSelectedBoilerplate] = useState('');
  const [selectedHeadlessComp, setSelectedHeadlessComp] = useState('');
  const [selectedUI, setSelectedUI] = useState('');
  const [selectedCompLib, setSelectedCompLib] = useState('');

    const boilerplates: SelectItem[] = [
      { label: "React", value: "react" },
      { label: "Solid", value: "solid", disabled: true },
      { label: "Svelte", value: "svelte", disabled: true },
      { label: "Vue", value: "vue", disabled: true },
    ];

    const headlessComp: SelectItem[] = [
          { label: "ArkUI ", value: "react" },
          { label: "radixUI", value: "solid", disabled: true },
        ];

    const UI: SelectItem[] = [
      { label: "Tailwind ", value: "react", disabled: true },
      { label: "Panda css", value: "solid" },
    ];

    const compLib: SelectItem[] = [
      { label: "ParkUI", value: "@park-ui" },
      { label: "shadcn/ui", value: "@shadcn/ui", disabled: true },
    ];


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
                  items={boilerplates}
                  onSelect={setSelectedBoilerplate}
                />
                <SelectComp
                  label="CSS framework"
                  items={UI}
                  onSelect={setSelectedUI}
                />
              </HStack>
            </div>
            <div className={css({pb: "18px"})}>
              <Heading className={css({ pt: "10px", pb: "6px" })}>
                Components / UI: :
              </Heading>
              <HStack gap="4">
                <SelectComp
                  label="Headless Component"
                  items={headlessComp}
                  onSelect={setSelectedHeadlessComp}
                />

                <SelectComp
                  label="Component library"
                  items={compLib}
                  onSelect={setSelectedCompLib}
                />
              </HStack>
            </div>
            {selectedBoilerplate &&
              selectedHeadlessComp &&
              selectedUI &&
              selectedCompLib && (
                <HStack gap="4">
                  <Heading>Tech stack:</Heading>
                  <Code background="lightblue" color="white">{selectedBoilerplate}</Code>
                  <Code background="lightseagreen" color="white">{selectedCompLib}</Code>
                  <Code background="gray.emphasized" color="white">{selectedHeadlessComp}</Code>
                  <Code background="green" color="white">{selectedUI}</Code>
                </HStack>
              )}
          </Stack>
        </Card.Body>
        <Card.Footer gap="3">
          <Button variant="outline">Cancel</Button>
          <Button
            disabled={
              !selectedBoilerplate ||
              !selectedHeadlessComp ||
              !selectedUI ||
              !selectedCompLib
            }
          >
            Next
          </Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}

type SelectCompProps = {
  label: string;
  items: SelectItem[];
  onSelect: (item: string) => void;
}


function SelectComp({label, items, onSelect}: SelectCompProps) {
  return (
    <Select.Root positioning={{ sameWidth: true }} width="2xs" items={items}>
      <Select.Label>{label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select" />
          <ChevronsUpDownIcon />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup>
            <Select.ItemGroupLabel>{label}</Select.ItemGroupLabel>
            {items.map((item) => (
              <Select.Item
                key={item.value}
                item={item}
                onClick={() => onSelect(item.label)}
              >
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

