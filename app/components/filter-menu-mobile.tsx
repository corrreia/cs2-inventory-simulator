/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import clsx from "clsx";
import { useTranslation } from "~/hooks/use-translation";
import { ITEM_FILTERS, ItemFilter } from "~/utils/filters";

export function FilterMenuMobile({
  onChange,
  value
}: {
  onChange: (newValue: ItemFilter) => void;
  value: ItemFilter;
}) {
  const translate = useTranslation();

  function handleClick(filter: ItemFilter) {
    return function handleClick() {
      onChange(filter);
    };
  }

  return (
    <div className="flex flex-wrap gap-1 px-2">
      {ITEM_FILTERS.map((filter, index) => (
        <button
          key={index}
          className={clsx(
            "rounded bg-opacity-50 px-2 transition-all hover:text-neutral-200",
            !(
              filter.category === value.category && filter.type === value.type
            ) && "text-neutral-400",
            filter.category === value.category &&
              filter.type === value.type &&
              "bg-black/50 text-neutral-200"
          )}
          onClick={handleClick(filter)}
        >
          {translate(`Category${filter.label}`)}
        </button>
      ))}
    </div>
  );
}
