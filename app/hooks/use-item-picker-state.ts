/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useMemo, useState } from "react";
import { useInput } from "./use-input";
import { ITEM_FILTERS, ItemFilter } from "~/utils/filters";
import { CS_Item } from "@ianlucas/cslib";
import { getBaseItems, getPaidItems } from "~/utils/economy";

export function useItemPickerState({
  onPickItem
}: {
  onPickItem: (item: CS_Item) => void;
}) {
  const [filter, setFilter] = useState(ITEM_FILTERS[0]);
  const [model, setModel] = useState<string | undefined>();
  const [query, setQuery] = useInput("");

  function reset() {
    setQuery("");
    setModel(undefined);
  }

  function handleCategoryClick(filter: ItemFilter) {
    setFilter(filter);
    return reset();
  }

  function handleItemClick(item: CS_Item) {
    if (!filter.hasModel || model !== undefined) {
      return onPickItem(item);
    }
    setQuery("");
    setModel(item.model);
  }

  const items = useMemo(
    () =>
      (model === undefined ? getBaseItems(filter) : getPaidItems(filter, model))
        .filter(({ name }) => {
          if (query.length < 2) {
            return true;
          }
          return name.toLowerCase().includes(query.toLowerCase());
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [filter, model, query]
  );

  const ignoreRarityColor = model === undefined && filter.hasModel;

  return {
    filter,
    handleCategoryClick,
    handleItemClick,
    ignoreRarityColor,
    items,
    query,
    setQuery
  };
}
