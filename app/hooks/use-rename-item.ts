/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_hasNametag, CS_isStorageUnitTool } from "@ianlucas/cslib";
import { useState } from "react";
import { useItemSelectorContext } from "~/components/item-selector-context";
import { useRootContext } from "~/components/root-context";

export function useRenameItem() {
  const { items } = useRootContext();
  const { itemSelector, setItemSelector } = useItemSelectorContext();
  const [renameItem, setRenameItem] = useState<{
    toolUid: number;
    targetUid: number;
  }>();

  function handleRenameItem(uid: number) {
    return setItemSelector({
      uid,
      items: items.filter(
        ({ item }) => CS_hasNametag(item) && !CS_isStorageUnitTool(item)
      ),
      type: "rename-item"
    });
  }

  function handleRenameItemSelect(uid: number) {
    return setRenameItem({
      targetUid: uid,
      toolUid: itemSelector!.uid
    });
  }

  function closeRenameItem() {
    return setRenameItem(undefined);
  }

  function isRenamingItem(
    state: typeof renameItem
  ): state is NonNullable<typeof renameItem> {
    return state !== undefined;
  }

  return {
    closeRenameItem,
    handleRenameItem,
    handleRenameItemSelect,
    isRenamingItem,
    renameItem
  };
}
