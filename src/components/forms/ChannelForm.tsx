"use client";

import { Title } from "@/common";
import { FormTextInput } from "@/common/FormInputs";
import { FormSelectInput } from "@/common/FormInputs/FormSelectInput";
import { getDefaults } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  channel_type: z.string().default(""),
  goals_and_objectives: z.string().default(""),
  audience: z.string().default(""),
  content_strategy: z.string().default(""),
  messaging_considerations: z.string().default(""),
});

type Form = z.infer<typeof formSchema>;

export function ChannelForm() {
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
            Create new Channel
          </Title>
          <div className={"mt-6 space-y-6"}>
            <FormSelectInput
              fieldName={"channel_type"}
              label={"Channel Type"}
              options={channelTypes}
              display={"Choose Channel Type"}
            />
            <FormSelectInput
              fieldName={"goals_and_objectives"}
              label={"Goals and Objectives"}
              options={goalsAndObjectives}
            />
            <FormSelectInput
              fieldName={"audience"}
              label={"Audience"}
              options={[]}
            />
            <div>
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
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

const channelTypes = [
  {
    label: "Owned Channels (Website, Blog, Email, Community)",
    value: "owned_channels",
  },
  {
    label: "Paid Channels (Search Ads, Social Ads, Sponsorships)",
    value: "paid_phannels",
  },
  {
    label: "Earned Channels (PR, Organic Social, Partnerships)",
    value: "earned_channels",
  },
  {
    label:
      "Third-Party Channels (Marketplaces, App Stores, Affiliate Networks)",
    value: "third-party_channels",
  },
];

const goalsAndObjectives = [
  {
    label: "Customer acquisition",
    value: "customer_acquisition",
  },
  {
    label: "Brand awareness",
    value: "brand_awareness",
  },
  {
    label: "Lead generation",
    value: "lead_generation",
  },
  {
    label: "Revenue growth",
    value: "revenue_growth",
  },
  {
    label: "Customer retention",
    value: "customer_retention",
  },
];

const contentStrategies = [
  {
    label: "SEO & Content Strategy",
    value: "SEO&content",
  },
  {
    label: "Paid Media & Retargeting",
    value: "paid_media&retargeting",
  },
  {
    label: "Email Marketing & Automation",
    value: "email_marketing&automation",
  },
  {
    label: "Sales Enablement & Partnerships",
    value: "sales_enablement&partnerships",
  },
];
{
  /* <DataServiceErrorAlert
  isError={login.isError}
  error={login.error}
/> */
}
