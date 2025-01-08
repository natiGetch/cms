import React, { useEffect } from "react";
import { Checkbox, Collapse, Popover } from "antd";
import DynamicForm from "./componetType";
import useFetchData from "@/hooks/useFetchData";
type ColabsableFormType = {
  activeKeys: string[];
  setActivekeys: (activeKeys: string[]) => void;
  fetchedData?: any;
  formConfigData: [];

}
const ColabsableForm = ({ activeKeys, setActivekeys, fetchedData,formConfigData} : ColabsableFormType) => {
  const { data: language } = useFetchData({ endpoint: "/api/language" });
  useEffect(() => {
    if (fetchedData) {
      const mandatoryLanguages = language?.language
        ?.filter((lang: { _id: string }) =>
          fetchedData?.translations?.some(
            (translation: any) => translation.language === lang._id
          )
        )
        .map((lang: { key: string }) => lang.key);
      setActivekeys(mandatoryLanguages);
    } else {
      const mandatoryLanguages = language?.language
        ?.filter((lang: { isMandatory: boolean }) => lang.isMandatory)
        .map((lang: { key: string }) => lang.key);
      setActivekeys(mandatoryLanguages);
    }
  }, [fetchedData, language]);
  return (
    <Collapse
      activeKey={activeKeys} //
    >
      {language?.language?.map(
        (lang: {
          _id: string;
          key: string;
          label: string;
          isMandatory: boolean;
        }) => (
          <Collapse.Panel
            key={lang.key}
            header={
              <div style={{ display: "flex", gap: "1em" }}>
                {lang.isMandatory ? (
                  <Popover
                    title="Since the languge is mandatory you must add this contnet in this laguage"
                    trigger="click"
                  >
                    <Checkbox checked />
                  </Popover>
                ) : (
                  <Checkbox
                  onClick={() => {
                    const newActiveKeys = activeKeys.includes(lang.key)
                      ? activeKeys.filter((item) => item !== lang.key)
                      : [...activeKeys, lang.key];
                    setActivekeys(newActiveKeys);
                  }}
                  />
                )}
                {lang.label}
              </div>
            }
            showArrow={false}
          >
            <DynamicForm formConfig={formConfigData} />
          </Collapse.Panel>
        )
      )}
    </Collapse>
  );
};

export default ColabsableForm;
