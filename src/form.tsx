import classNames from "classnames";
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormReturn,
} from "react-hook-form";

export function TextInput<T extends FieldValues>({
  label,
  field,
  form,
  required = false,
  validate,
}: {
  label: string;
  field: Path<T>;
  form: UseFormReturn<T>;
  required?: boolean;
  validate?: RegisterOptions<T, Path<T>>["validate"];
}) {
  return (
    <TextLikeInput
      type="text"
      label={label}
      field={field}
      form={form}
      required={required}
      validate={validate}
    />
  );
}

export function EmailInput<T extends FieldValues>({
  label,
  field,
  form,
  required = false,
  validate,
}: {
  label: string;
  field: Path<T>;
  form: UseFormReturn<T>;
  required?: boolean;
  validate?: RegisterOptions<T, Path<T>>["validate"];
}) {
  return (
    <TextLikeInput
      type="email"
      label={label}
      field={field}
      form={form}
      required={required}
      validate={validate}
    />
  );
}

export function PasswordInput<T extends FieldValues>({
  label,
  field,
  form,
  required = false,
  validate,
}: {
  label: string;
  field: Path<T>;
  form: UseFormReturn<T>;
  required?: boolean;
  validate?: RegisterOptions<T, Path<T>>["validate"];
}) {
  return (
    <TextLikeInput
      type="password"
      label={label}
      field={field}
      form={form}
      required={required}
      validate={validate}
    />
  );
}

function TextLikeInput<T extends FieldValues>({
  type,
  label,
  field,
  form,
  validate,
  required = false,
}: {
  type: "text" | "email" | "password";
  label: string;
  field: Path<T>;
  form: UseFormReturn<T>;
  validate?: RegisterOptions<T, Path<T>>["validate"];
  required?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[field];
  const errorMessage =
    error && error.message && typeof error.message === "string"
      ? error.message
      : null;

  return (
    <div>
      <label
        htmlFor={field}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <input
        id={field}
        type={type}
        autoComplete={field}
        className={classNames(
          "block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
          {
            "text-gray-900": !errorMessage,
            "placeholder:text-gray-400": !errorMessage,
            "ring-gray-300": !errorMessage,
            "focus:ring-indigo-600": !errorMessage,
            "text-red-900": errorMessage,
            "placeholder:text-red-400": errorMessage,
            "ring-red-300": errorMessage,
            "focus:ring-red-600": errorMessage,
          },
        )}
        {...register(field, {
          required: required ? `${label} is required` : undefined,
          validate: validate,
        })}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
