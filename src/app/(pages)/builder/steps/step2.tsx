"use client"
import * as Card from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Stack, HStack } from "styled-system/jsx";
import { gridItem, grid, aspectRatio } from "styled-system/patterns";
import { css } from "styled-system/css";
import { Plugin } from "../../../types/building";
import PluginCard from "~/app/components/pluginCard";
import * as Tooltip from "~/components/ui/tooltip";

type Props = {
  onSelect: (plugin: Plugin) => void;
  selected: Plugin[];
}

const plugins: Plugin[] = [
  {
    name: "Next Auth",
    family: "auth",
    description: "Next Auth is a library for adding authentication to your Next.js application.",
    image: "/plugins/next-auth.png",
    rating: 5,
  },
  {
    name: "Prisma",
    family: "database",
    description: "Prisma is a library for adding authentication to your Next.js application.",
    image: "/plugins/prisma.png",
    rating: 4.5,
  },
  {
    name: "I18n",
    family: "translation",
    description: "I18n is a library for adding internationalization to your Next.js application.",
    image: "/plugins/i18n.png",
    rating: 4,
  }
]

const fetchingPlugins: Plugin[] = [
  {
    name: "SWR",
    family: "data_fetching",
    description:
      "Lightweight and easy to use, best for simple projects. Created by Vercel",
    image: "/plugins/swr.png",
    rating: 4,
  },
  {
    name: "React Query",
    family: "data_fetching",
    description: "Extensives features, best for complex projects. Open source",
    image: "/plugins/react-query.png",
    rating: 4,
  },
];

function Step2({ onSelect, selected }: Props) {

  console.log(selected.includes(plugins[0]))

  

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
            <div
              className={grid({
                columns: 4,
                gap: "4",
                overflowY: "auto",
                padding: "2",
              })}
            >
              {plugins.map((plugin) => (
                <PluginCard
                  key={plugin.name}
                  plugin={plugin}
                  onSelect={(plugin) => onSelect(plugin)}
                  selected={selected.includes(plugin)}
                />
              ))}
            </div>
            <div>
              <Heading className={css({ pt: "10px", pb: "6px" })}>
                Data fetching:
              </Heading>
              <div
                className={grid({
                  columns: 4,
                  gap: "4",
                  overflowY: "auto",
                  padding: "2",
                })}
              >
                {fetchingPlugins.map((plugin) => (
                  <PluginCard
                    key={plugin.name}
                    plugin={plugin}
                    onSelect={(plugin) => onSelect(plugin)}
                    selected={selected.includes(plugin)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Stack>
      </Card.Body>
    </>
  );
}

export default Step2

