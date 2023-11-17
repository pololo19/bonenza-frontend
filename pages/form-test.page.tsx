import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useTranslation } from "@/base/config/i18next";
import InputDatePicker from "@/components/input/datePicker/inputDatePicker";
import SelectBox from "@/components/input/selectBox/selectBox";
import InputTimePicker from "@/components/input/timePicker/inputTimePicker";
import InputNumber from "@/components/input/typing/InputNumber";
import InputText from "@/components/input/typing/InputText";
import Textarea from "@/components/input/typing/Textarea";
// import InputCheck from '@/components/input/check/inputCheck';

function FormPage() {
  const { t } = useTranslation("common");

  const onSubmit = async (data: Record<string, unknown>) => {
    console.log(data);
  };

  const schema = yup.object().shape({
    select: yup
      .object()
      .nullable()
      .required(t("required") || ""),
    text: yup
      .string()
      .required(t("required") || "")
      .trim(),
    num: yup
      .string()
      .required(t("required") || "")
      .trim(),
    textarea: yup
      .string()
      .required(t("required") || "")
      .trim(),
    date: yup
      .array()
      .nullable()
      .required(t("required") || ""),
    time: yup
      .array()
      .nullable()
      .required(t("required") || ""),
  });

  // Mock data test
  const sData = [
    { id: "1", name: "Option 1" },
    { id: "2", name: "Option 2" },
  ];

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div data-testid="title" className="p-5 bg-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="select" className="required">
            {t("select_box")}
          </label>
          <SelectBox
            control={control}
            name="select"
            placeholder={t("placeholder")}
            options={sData}
            getOptionLabel={(option) => option?.name || ""}
            getOptionValue={(option) => option?.id || ""}
            isClearable
          />
        </div>
        <div className="mt-3">
          <label htmlFor="text" className="required">
            {t("input_text")}
          </label>
          <InputText
            control={control}
            name="text"
            placeholder={String(t("placeholder"))}
            data-testid="event_name_input"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="num" className="required">
            {t("input_number")}
          </label>
          <InputNumber
            control={control}
            name="num"
            placeholder={String(t("placeholder"))}
            data-testid="event_name_input"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="textarea" className="required">
            {t("textarea")}
          </label>
          <Textarea
            control={control}
            name="textarea"
            placeholder={String(t("placeholder"))}
            data-testid="event_name_input"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="date" className="required">
            {t("date_picker")}
          </label>
          <InputDatePicker
            control={control}
            type="datetime-local"
            name="date"
            placeholder={String(t("placeholder"))}
            data-testid="event_name_input"
          />
        </div>
        <div className="mt-3">
          <label htmlFor="time" className="required">
            {t("time_picker")}
          </label>
          <InputTimePicker
            control={control}
            name="time"
            placeholder={String(t("placeholder"))}
            data-testid="event_name_input"
          />
        </div>
        {/* <div controlId="checkbox" className="mt-3">
          <label className="required">{t('checkbox')}</label>
          <InputCheck
            type="checkbox"
            control={control}
            name="check"
            data-testid="event_name_input"
            onChange={(data) => console.log(data)}
          />
        </div> */}
        {/* <div controlId="radio" className="mt-3">
          <label className="required">{t('radio')}</label>
          <InputCheck type="radio" control={control} name="radio" value={1} data-testid="event_name_input" />
          <InputCheck type="radio" control={control} name="radio" value={2} data-testid="event_name_input" />
        </div>
        <div controlId="switch" className="mt-3">
          <label className="required">{t('switch')}</label>
          <InputCheck type="switch" control={control} name="switch" data-testid="event_name_input" />
        </div> */}
        <button type="submit" className="mt-3">
          {t("Submit")}
        </button>
      </form>
    </div>
  );
}

export default FormPage;
