/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { EditorToggle } from "~/components/editor-toggle";
import { LanguageSelect } from "~/components/language-select";
import { Modal } from "~/components/modal";
import { ModalButton } from "~/components/modal-button";
import { useRootContext } from "~/components/root-context";
import { Select } from "~/components/select";
import { useCheckbox } from "~/hooks/use-checkbox";
import { useTranslation } from "~/hooks/use-translation";
import { backgrounds } from "~/preferences/background.server";
import { languages } from "~/preferences/language.server";
import { ApiActionPreferencesUrl } from "./api.action.preferences._index";
import { middleware } from "~/http.server";

export const meta: MetaFunction = () => {
  return [{ title: "Settings - CS2 Inventory Simulator" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await middleware(request);
  return typedjson({
    backgrounds,
    languages: languages.map(({ name, countries }) => ({
      name,
      country: countries[0]
    }))
  });
}

export default function Settings() {
  const { backgrounds, languages } = useTypedLoaderData<typeof loader>();
  const {
    preferences: {
      background: selectedBackground,
      language: selectedLanguage,
      statsForNerds: selectedStatsForNerds,
      hideFreeItems: selectedHideFreeItems
    }
  } = useRootContext();

  const [language, setLanguage] = useState(selectedLanguage);
  const [background, setBackground] = useState(selectedBackground);
  const [statsForNerds, setStatsForNerds] = useCheckbox(selectedStatsForNerds);
  const [hideFreeItems, setHideFreeItems] = useCheckbox(selectedHideFreeItems);

  const translate = useTranslation();
  const submit = useSubmit();

  function handleSubmit() {
    submit(
      {
        background,
        hideFreeItems,
        language,
        statsForNerds
      },
      {
        action: ApiActionPreferencesUrl,
        method: "POST"
      }
    );
  }

  return (
    <Modal className="w-[540px]">
      <div className="flex select-none items-center justify-between px-4 py-2 text-sm font-bold">
        <span className="text-neutral-400">{translate("SettingsHeader")}</span>
        <div className="flex items-center">
          <Link className="opacity-50 hover:opacity-100" to="/">
            <FontAwesomeIcon icon={faXmark} className="h-4" />
          </Link>
        </div>
      </div>
      <div className="space-y-2 px-4">
        <div>
          <label className="font-bold text-neutral-500">
            {translate("SettingsLanguage")}
          </label>
          <LanguageSelect
            languages={languages}
            value={language}
            onChange={setLanguage}
          />
        </div>
        <div>
          <label className="font-bold text-neutral-500">
            {translate("SettingsBackground")}
          </label>
          <Select
            value={background}
            onChange={setBackground}
            options={backgrounds}
            children={({ label }) => label}
          />
        </div>
        <div>
          <label className="font-bold text-neutral-500">
            {translate("SettingsStatsForNerds")}
          </label>
          <div>
            <EditorToggle checked={statsForNerds} onChange={setStatsForNerds} />
          </div>
        </div>
        <div>
          <label className="font-bold text-neutral-500">
            {translate("SettingsHideFreeItems")}
          </label>
          <div>
            <EditorToggle checked={hideFreeItems} onChange={setHideFreeItems} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2 px-4 pb-4">
        <ModalButton
          children={translate("SettingsSave")}
          className="px-2"
          onClick={handleSubmit}
          variant="primary"
        />
      </div>
    </Modal>
  );
}
