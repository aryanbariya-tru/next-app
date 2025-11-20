"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileInput from "@/app/components/inputs/FileInput";
import { ALLOWED_FILE_TYPES, AllowedFileType } from "@/app/utils/fileTypes";
import { useRegisterStore } from "@/app/store/regusersStore";
type FormData = z.infer<typeof registerSchema>;
const { fetchRegusers, createReguser } = useRegisterStore.getState();

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  files: z
    .array(z.instanceof(File))
    .nonempty("Please upload at least one file")
    .refine(
      (files) => files.every((f) => f.size <= 2 * 1024 * 1024),
      "Each file must be smaller than 2MB"
    )
    .refine(
      (files) =>
        files.every((f) =>
          ALLOWED_FILE_TYPES.includes(f.type as AllowedFileType)
        ),
      `Only ${ALLOWED_FILE_TYPES.join(", ")} files are allowed`
    ),
});

export default function RegisterPage() {
  const { results } = useRegisterStore();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { files: [] },
  });
  const [message, setMessage] = React.useState("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setMessage("Submitting...");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);
    data.files.forEach((f) => formData.append("files", f));

    const response = await createReguser(formData);

    if (response.success) {
      setMessage("✅ Submitted successfully!");
      reset();
    } else {
      setMessage("❌ Failed to submit");
    }
  };

  useEffect(() => {
    fetchRegusers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Upload Form
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            {...register("name")}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Your Email"
            {...register("email")}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            type="text"
            placeholder="Your password"
            {...register("password")}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Role */}
          <select
            {...register("role")}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}

          {/* File Upload */}
          <Controller
            name="files"
            control={control}
            render={({ field }) => (
              <FileInput
                value={field.value}
                onChange={field.onChange}
                error={errors.files?.message}
                label="Upload Resume"
                accept={ALLOWED_FILE_TYPES.join(",")}
              />
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center text-base font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("❌")
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2">
        {results.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow mt-4">
            <div className="flex flex-col space-y-2">
              <span className="text-xl font-bold">{user.name}</span>
              <span className="text-xl font-bold">{user.role}</span>
              <span className="text-xl font-bold">{user.email}</span>
            </div>

            {user.files?.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600">
                {user.files.map((f) => (
                  <li key={f.id}>
                    <a
                      href={f.url}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      {f.url.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
