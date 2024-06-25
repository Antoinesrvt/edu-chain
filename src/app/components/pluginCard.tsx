import * as Card from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { gridItem, aspectRatio, center } from "styled-system/patterns";
import { Plugin } from "~/app/types/building";
import * as Tooltip from "~/components/ui/tooltip";
import { css } from "styled-system/css";

type PluginCardProps = {
  plugin: Plugin;
  onSelect: (plugin: Plugin) => void;
  selected: boolean;
};

export default function PluginCard({ plugin, onSelect, selected }: PluginCardProps) {

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          className={gridItem({
            colSpan: 1,
            rowSpan: 1,
          })}
        >
          <div
            key={`${plugin.name}-${selected}`}
            className={aspectRatio({
              cursor: "pointer",
              ratio: 1,
              w: "full",
              borderWidth: "1px",
              rounded: "lg",
              shadow: "shadow",
              borderColor: selected ? "blue" : "gray.6",
              backgroundColor: selected ? "gray.2" : "white",
              _dark: { bgColor: "gray.800", borderColor: "gray.700" },
            })}
            onClick={() => onSelect(plugin)}
          >
            {/* <a href="#">
        <img
          className={css({
            p: "8",
            roundedTopLeft: "t.lg",
            roundedTopRight: "t.lg",
          })}
          src={plugin.image}
          alt="product image"
        />
      </a> */}
              <div className={center({p: 1})}>
                  <Heading className={css({textAlign: "center", overflow: "hidden"})}>{plugin.name}</Heading>
                {/* <div
          className={css({
            display: "flex",
            alignItems: "center",
            mt: "2.5",
            mb: "5",
          })}
        >
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              mr: "1",
              ml: "1",
            })}
          >
            <RatingGroup colorPalette="red" value={plugin.rating}/>
          </div>
          <span
            className={css({
              bgColor: "blue.100",
              color: "blue.800",
              fontSize: "xs",
              lineHeight: "xs",
              fontWeight: "semibold",
              pl: "2.5",
              pr: "2.5",
              pt: "0.5",
              pb: "0.5",
              rounded: "rounded",
              _dark: { bgColor: "blue.200", color: "blue.800" },
              marginInlineStart: "ms.3",
            })}
          >
            5.0
          </span>
        </div> */}
              </div>

          </div>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Arrow>
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
        <Tooltip.Content>{plugin.description}</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}
