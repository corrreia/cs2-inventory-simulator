/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CS_INVENTORY_NO_STICKERS,
  CS_INVENTORY_NO_STICKERS_WEAR,
  CS_Item,
  CS_MAX_SEED,
  CS_MAX_WEAR,
  CS_MIN_SEED,
  CS_MIN_WEAR,
  CS_NO_STICKER,
  CS_NO_STICKER_WEAR,
  CS_WEAR_FACTOR,
  CS_hasNametag,
  CS_hasSeed,
  CS_hasStatTrak,
  CS_hasStickers,
  CS_hasWear,
  CS_safeValidateNametag,
  CS_safeValidateSeed,
  CS_safeValidateWear
} from "@ianlucas/cslib";
import clsx from "clsx";
import { useState } from "react";
import { useCheckbox } from "~/hooks/use-checkbox";
import { useInput } from "~/hooks/use-input";
import { useTranslation } from "~/hooks/use-translation";
import {
  seedStringMaxLen,
  showQuantity,
  wearStringMaxLen,
  wearToString
} from "~/utils/economy";
import { CSItemImage } from "./cs-item-image";
import { CSItemName } from "./cs-item-name";
import { EditorInput } from "./editor-input";
import { EditorStepRangeWithInput } from "./editor-step-range-with-input";
import { EditorToggle } from "./editor-toggle";
import { ModalButton } from "./modal-button";
import { useRootContext } from "./root-context";
import { StickerPicker } from "./sticker-picker";

export interface CSItemEditorAttributes {
  nametag?: string;
  quantity: number;
  seed?: number;
  stattrak?: boolean;
  stickers?: number[];
  stickerswear?: number[];
  wear?: number;
}

export function CSItemEditor({
  attributes,
  item,
  onReset,
  onSubmit
}: {
  attributes?: {
    nametag?: string;
    seed?: number;
    stattrak?: number;
    stickers?: number[];
    stickerswear?: number[];
    wear?: number;
  };
  item: CS_Item;
  onReset: () => void;
  onSubmit: (props: CSItemEditorAttributes) => void;
}) {
  const translate = useTranslation();
  const {
    env: { maxInventoryItems },
    inventory
  } = useRootContext();
  const [stattrak, setStattrak] = useCheckbox(
    attributes?.stattrak !== undefined ? attributes.stattrak >= 0 : false
  );
  const [wear, setWear] = useState(
    attributes?.wear ?? item.wearmin ?? CS_MIN_WEAR
  );
  const [seed, setSeed] = useState(attributes?.seed ?? 1);
  const [nametag, setNametag] = useInput(attributes?.nametag ?? "");
  const [stickersAttributes, setStickersAttributes] = useState({
    ids: attributes?.stickers ?? CS_INVENTORY_NO_STICKERS.slice(),
    wears: attributes?.stickerswear ?? CS_INVENTORY_NO_STICKERS_WEAR.slice()
  });
  const [quantity, setQuantity] = useState(1);
  const hasStickers = CS_hasStickers(item);
  const hasStattrak = CS_hasStatTrak(item);
  const hasSeed = CS_hasSeed(item);
  const hasWear = CS_hasWear(item);
  const hasNametag = CS_hasNametag(item);
  const canCraft =
    CS_safeValidateWear(wear) &&
    (CS_safeValidateNametag(nametag) || nametag.length === 0) &&
    CS_safeValidateSeed(seed);
  const maxQuantity = maxInventoryItems - inventory.size();
  const hasQuantity = showQuantity(item);
  const isCrafting = attributes === undefined;

  function handleSubmit() {
    const stickers =
      hasStickers &&
      stickersAttributes.ids.filter((sticker) => sticker !== CS_NO_STICKER)
        .length > 0
        ? stickersAttributes.ids
        : undefined;

    const stickerswear =
      hasStickers &&
      stickersAttributes.wears.filter((wear) => wear !== CS_NO_STICKER_WEAR)
        .length > 0
        ? stickersAttributes.wears
        : undefined;

    onSubmit({
      nametag: hasNametag && nametag.length > 0 ? nametag : undefined,
      quantity,
      seed: hasSeed && (!isCrafting || seed !== CS_MIN_SEED) ? seed : undefined,
      stattrak: hasStattrak && stattrak === true ? stattrak : undefined,
      stickers,
      stickerswear,
      wear: hasWear && (!isCrafting || wear !== CS_MIN_WEAR) ? wear : undefined
    });
  }

  return (
    <div className="m-auto w-[360px] select-none px-4 pb-6 lg:px-0">
      <CSItemImage
        className="m-auto h-[192px] w-[256px]"
        item={item}
        wear={CS_hasWear(item) ? wear : undefined}
      />
      <div
        className={clsx("mb-4 text-center", item.type === "agent" && "mt-4")}
      >
        <CSItemName item={item} />
      </div>
      <div className="space-y-4">
        {hasStickers && (
          <div>
            <label className="w-[76.33px] select-none font-bold text-neutral-500">
              {translate("EditorStickers")}
            </label>
            <StickerPicker
              value={stickersAttributes}
              onChange={setStickersAttributes}
            />
          </div>
        )}
        {hasNametag && (
          <div className="flex items-center gap-4">
            <label className="w-[76.33px] select-none font-bold text-neutral-500">
              {translate("EditorNametag")}
            </label>
            <EditorInput
              maxLength={20}
              onChange={setNametag}
              placeholder={translate("EditorNametagPlaceholder")}
              validate={(nametag) => CS_safeValidateNametag(nametag ?? "")}
              value={nametag}
            />
          </div>
        )}
        {hasSeed && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorSeed")}
            </label>
            <EditorStepRangeWithInput
              inputStyles="w-[68px]"
              maxLength={seedStringMaxLen}
              validate={(value) => CS_safeValidateSeed(value, item)}
              stepRangeStyles="flex-1"
              min={CS_MIN_SEED}
              max={CS_MAX_SEED}
              step={CS_MIN_SEED}
              value={seed}
              onChange={setSeed}
            />
          </div>
        )}
        {hasWear && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorWear")}
            </label>
            <EditorStepRangeWithInput
              inputStyles="w-[68px]"
              transform={wearToString}
              maxLength={wearStringMaxLen}
              validate={(value) => CS_safeValidateWear(value, item)}
              stepRangeStyles="flex-1"
              min={item.wearmin ?? CS_MIN_WEAR}
              max={item.wearmax ?? CS_MAX_WEAR}
              step={CS_WEAR_FACTOR}
              value={wear}
              onChange={setWear}
            />
          </div>
        )}
        {hasStattrak && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorStatTrak")}
            </label>
            <EditorToggle checked={stattrak} onChange={setStattrak} />
          </div>
        )}
        {hasQuantity && (
          <div className="flex select-none items-center gap-4">
            <label className="w-[76.33px] font-bold text-neutral-500">
              {translate("EditorQuantity")}
            </label>
            <EditorStepRangeWithInput
              inputStyles="w-[68px]"
              maxLength={String(maxQuantity).length}
              validate={(value) => value >= 1 && value <= maxQuantity}
              stepRangeStyles="flex-1"
              min={1}
              max={maxQuantity}
              step={1}
              value={quantity}
              onChange={setQuantity}
            />
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <ModalButton className="px-2" variant="secondary" onClick={onReset}>
          {isCrafting && (
            <FontAwesomeIcon icon={faLongArrowLeft} className="mr-2 h-4" />
          )}
          {translate(isCrafting ? "EditorReset" : "EditorCancel")}
        </ModalButton>
        <ModalButton
          children={translate(isCrafting ? "EditorCraft" : "EditorSave")}
          className="px-2"
          disabled={!canCraft}
          onClick={handleSubmit}
          variant="primary"
        />
      </div>
    </div>
  );
}
