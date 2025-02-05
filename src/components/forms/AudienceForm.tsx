"use client";

import { Title } from "@/common";
import { FormTextInput } from "@/common/FormInputs";
import { FormSelectInput } from "@/common/FormInputs/FormSelectInput";
import { getDefaults } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  audience_name: z.string().default(""),
  audience_type: z.string().default(""),
  description: z.string().default(""),
  problems: z.array(z.string()).default([]),
  product_solutions: z.array(z.string()).default([]),
  attraction: z.string().default(""),
  engagement: z.string().default(""),
  common_objections: z.array(z.string()).default([]),
  common_channels: z.array(z.string()).default([]),
  trusted_platforms: z.array(z.string()).default([]),
  complementary_problems: z.array(z.string()).default([]),
  voc: z.object({
    title: z.string().default(""),
    quote: z.string().default(""),
    audience: z.string().default(""),
    attachment: z.string().default(""),
    customer_name: z.string().default(""),
    customer_title: z.string().default(""),
    customer_comment: z.string().default(""),
    screenshot: z.string().default(""),
  }),
  note: z.object({
    title: z.string().default(""),
    date_stamp: z.string().default(Date.now().toString()),
  }),
});

type Form = z.infer<typeof formSchema>;

export function AudienceForm() {
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaults(formSchema),
  });

  function onSubmit(data: Form) {
    console.log("Form Data: ", data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete={"off"}>
        <div className={"overflow-hidden rounded-lg bg-white shadow p-6"}>
          <Title component={"h4"} size={"lg"}>
            Create new Audience
          </Title>
          <div className={"mt-6 space-y-6"}>
            <FormTextInput
              fieldName={"audience_name"}
              label={"Audience Name"}
              placeholder={"Audience Name"}
            />
            <FormSelectInput
              fieldName={"audience_type"}
              label={"Audience Type"}
              options={audienceTypes}
            />
            <FormTextInput
              fieldName={"description"}
              label={"Description"}
              multiline
              placeholder={"Description"}
            />
            {/* <div>
              <Title component={"h5"} size={"base"}>
                Channel Messaging
              </Title>
              <div className={"space-y-6 mt-4"}>
                <FormSelectInput
                  fieldName={"content_strategy"}
                  label={"Content Strategy"}
                  options={contentStrategies}
                />
                <FormTextInput
                  fieldName={"messaging_considerations"}
                  label={"Messaging considerations"}
                  multiline
                  placeholder={"Describe your platform nuance"}
                />
              </div>
            </div> */}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

const audienceTypes = [
  {
    label: "B2B",
    value: "b2b",
  },
  {
    label: "B2C",
    value: "b2c",
  },
  {
    label: "Government",
    value: "government",
  },
  {
    label: "Non-profit",
    value: "non-profit",
  },
  {
    label: "Other",
    value: "other",
  },
];

{
  /* <DataServiceErrorAlert
  isError={login.isError}
  error={login.error}
/> */
}
