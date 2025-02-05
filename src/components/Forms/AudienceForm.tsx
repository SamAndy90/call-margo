"use client";

import { Title } from "@/common";
import { FormTextInput } from "@/common/FormInputs";
import { FormSelectInput } from "@/common/FormInputs/FormSelectInput";
import { Button } from "@/common/UI";
import { getDefaults } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  audience_name: z.string().min(1, "Name is required").default(""),
  audience_type: z.string().min(1, "Type is required").default(""),
  description: z.string().default(""),
  problems: z.array(z.string()).default([]),
  product_solutions: z.array(z.string()).default([]),
  attraction: z.string().min(1, "Attraction is required").default(""),
  engagement: z.string().min(1, "Engagement is required").default(""),
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
          <div className={"my-6 space-y-6"}>
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
            <FormSelectInput
              fieldName={"problems"}
              label={"Problems"}
              multiple
              options={[
                { label: "Problem1", value: "1" },
                { label: "Problem2", value: "2" },
              ]}
            />
            <FormSelectInput
              fieldName={"product_solutions"}
              label={"Product Solutions"}
              multiple
              options={[
                { label: "Solution1", value: "1" },
                { label: "Solution2", value: "2" },
              ]}
            />
            <FormTextInput
              fieldName={"attraction"}
              label={"Attraction"}
              placeholder={"Attraction"}
            />
            <FormTextInput
              fieldName={"engagement"}
              label={"Engagement"}
              placeholder={"Engagement"}
            />
            <FormSelectInput
              fieldName={"common_objections"}
              label={"Common Objections"}
              multiple
              options={[
                { label: "Objection1", value: "1" },
                { label: "Objection2", value: "2" },
              ]}
            />
            <FormSelectInput
              fieldName={"common_channels"}
              label={"Common Channels"}
              multiple
              options={[
                { label: "Channel1", value: "1" },
                { label: "Channel2", value: "2" },
              ]}
            />
            <FormSelectInput
              fieldName={"trusted_platforms"}
              label={"Trusted Platforms"}
              multiple
              options={[
                { label: "Platform1", value: "1" },
                { label: "Platform2", value: "2" },
              ]}
            />
            <FormSelectInput
              fieldName={"complementary_problems"}
              label={"Complementary Problems"}
              multiple
              options={[
                { label: "Problem1", value: "1" },
                { label: "Problem2", value: "2" },
              ]}
            />
            <div>
              <Title component={"h5"} size={"base"}>
                VOC (Voice of Customer)
              </Title>
              <div className={"space-y-6 mt-4"}>
                <FormTextInput
                  fieldName={"voc.title"}
                  label={"Title"}
                  placeholder={"Title"}
                />
                <FormTextInput
                  fieldName={"voc.quote"}
                  label={"Quote"}
                  multiline
                  placeholder={"Quote"}
                />
                <FormSelectInput
                  fieldName={"voc.audience"}
                  label={"Audience"}
                  options={[]}
                />
                <input type="file" {...form.register("voc.attachment")} />
                <FormTextInput
                  fieldName={"voc.customer_name"}
                  label={"Name"}
                  placeholder={"Name"}
                />
                <FormTextInput
                  fieldName={"voc.customer_title"}
                  label={"Customer title"}
                  placeholder={"Customer title"}
                />
                <FormTextInput
                  fieldName={"voc.customer_comment"}
                  label={"Customer comment"}
                  multiline
                  placeholder={"Comment"}
                />
                <input type="file" {...form.register("voc.screenshot")} />
              </div>
            </div>

            <div>
              <Title component={"h5"} size={"base"}>
                Note
              </Title>
              <div className={"space-y-6 mt-4"}>
                <FormTextInput
                  fieldName={"note.title"}
                  placeholder={"Leave here your note"}
                />
              </div>
            </div>
          </div>
          <Button type={"submit"}>Create</Button>
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
