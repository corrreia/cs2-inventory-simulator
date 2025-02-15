/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_unlockCase } from "@ianlucas/cslib";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useFreeze } from "~/hooks/use-freeze";
import { useTimer } from "~/hooks/use-timer";
import {
  ApiActionUnlockCaseActionData,
  ApiActionUnlockCaseUrl
} from "~/routes/api.action.unlock-case._index";
import { postJson } from "~/utils/fetch";
import { range } from "~/utils/number";
import { playSound } from "~/utils/sound";
import { useRootContext } from "./root-context";
import { UnlockCaseContainer } from "./unlock-case-container";
import { UnlockCaseContainerUnlocked } from "./unlock-case-container-unlocked";

export function UnlockCase({
  caseUid,
  keyUid,
  onClose
}: {
  caseUid: number;
  keyUid?: number;
  onClose: () => void;
}) {
  const { user, inventory, setInventory } = useRootContext();
  const [items, setItems] = useState<ReturnType<typeof CS_unlockCase>[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [canUnlock, setCanUnlock] = useState(true);
  const [unlockedItem, setUnlockedItem] =
    useState<ReturnType<typeof CS_unlockCase>>();
  const [hideCaseContents, setHideCaseContents] = useState(false);
  const caseItem = useFreeze(() => inventory.getItem(caseUid));
  const keyItem = useFreeze(() =>
    keyUid !== undefined ? inventory.getItem(keyUid) : undefined
  );
  const wait = useTimer();

  async function handleUnlock() {
    setIsDisplaying(false);
    setCanUnlock(false);
    const unlockedItem =
      user === undefined
        ? CS_unlockCase(caseItem)
        : await postJson<ApiActionUnlockCaseActionData>(
            ApiActionUnlockCaseUrl,
            { caseUid, keyUid }
          );
    wait(() => {
      setHideCaseContents(true);
      if (caseItem.keys !== undefined) {
        playSound("case_unlock");
      }
      wait(() => {
        setItems(
          range(32).map((_, index) =>
            index === 28 ? unlockedItem : CS_unlockCase(caseItem)
          )
        );
        setIsDisplaying(true);
        wait(() => {
          setUnlockedItem(unlockedItem);
          setInventory(inventory.unlockCase(unlockedItem, caseUid, keyUid));
        }, 6000);
      }, 100);
    }, 250);
  }

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <div className="fixed left-0 top-0 z-50 flex h-full w-full select-none items-center justify-center bg-black/60 backdrop-blur-sm">
            {unlockedItem ? (
              <UnlockCaseContainerUnlocked
                caseItem={caseItem}
                onClose={onClose}
                unlockedItem={unlockedItem}
              />
            ) : (
              <UnlockCaseContainer
                canUnlock={canUnlock}
                caseItem={caseItem}
                hideCaseContents={hideCaseContents}
                isDisplaying={isDisplaying}
                items={items}
                keyItem={keyItem}
                onClose={onClose}
                onUnlock={handleUnlock}
              />
            )}
          </div>,
          document.body
        )
      }
    />
  );
}
