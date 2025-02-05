import { path } from "ramda";
import {
  Controller,
  FieldError,
  FieldValues,
  Path,
  useFormContext,
} from "react-hook-form";
import { TextInput, TextInputProps } from "@/common/UI";

export type FormTextInputProps<T> = {
  fieldName: Path<T>;
} & TextInputProps;

export function FormTextInput<T extends FieldValues>(
  props: FormTextInputProps<T>
) {
  const { fieldName, ...textInputProps } = props;
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, formState: { errors } }) => {
        const error = path<FieldError>(fieldName.split("."), errors);

        return (
          <TextInput
            {...textInputProps}
            {...field}
            error={!!error}
            helperText={error?.message}
          />
        );
      }}
    />
  );
}
