/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_Item, CS_unlockCase } from "@ianlucas/cslib";
import { useTranslation } from "~/hooks/use-translation";
import { UnlockCaseContainerBackground } from "./unlock-case-container-background";
import { UnlockCaseContainerContents } from "./unlock-case-container-contents";
import { UnlockCaseWheel } from "./unlock-case-wheel";
import { CSItemImage } from "./cs-item-image";
import { FillSpinner } from "./fill-spinner";
import { ModalButton } from "./modal-button";
import { UseItemFooter } from "./use-item-footer";
import { UseItemHeader } from "./use-item-header";

export function UnlockCaseContainer({
  canUnlock,
  caseItem,
  hideCaseContents,
  isDisplaying,
  items,
  keyItem,
  onClose,
  onUnlock
}: {
  canUnlock: boolean;
  caseItem: CS_Item;
  hideCaseContents: boolean;
  isDisplaying: boolean;
  items: ReturnType<typeof CS_unlockCase>[];
  keyItem?: CS_Item;
  onClose: () => void;
  onUnlock: () => void;
}) {
  const translate = useTranslation();

  return (
    <>
      <UnlockCaseContainerBackground
        canUnlock={canUnlock}
        caseItem={caseItem}
      />
      <div className="flex flex-col gap-4">
        <UseItemHeader
          actionDesc={translate("CaseUnlock")}
          actionItem={caseItem.name}
          title={translate("CaseUnlockContainer")}
          warning={translate("CaseOnceWarn")}
        />
        <UnlockCaseWheel
          caseItem={caseItem}
          isDisplaying={isDisplaying}
          items={items}
        />
      </div>
      <div className="fixed bottom-12 left-0 w-full">
        <UnlockCaseContainerContents
          caseItem={caseItem}
          hideCaseContents={hideCaseContents}
        />
        <UseItemFooter
          left={
            keyItem !== undefined && (
              <div className="flex items-center gap-2 font-display text-lg">
                <CSItemImage className="h-14" item={keyItem} />
                <span>
                  {translate("CaseUse")} <strong>{keyItem.name}</strong>
                </span>
              </div>
            )
          }
          right={
            <>
              {canUnlock ? (
                <ModalButton
                  children={translate("CaseUnlockContainer")}
                  disabled={!canUnlock}
                  onClick={onUnlock}
                  variant="primary"
                />
              ) : (
                <FillSpinner className="mx-4" />
              )}
              <ModalButton
                children={translate("CaseClose")}
                disabled={!canUnlock}
                onClick={onClose}
                variant="secondary"
              />
            </>
          }
        />
      </div>
    </>
  );
}
