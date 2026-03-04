import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verificationSchema } from "../validation/schemas";

export default function StepVerification({
  formData,
  setFormData,
  next,
  prev,
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: formData,
  });

  const governmentId = watch("governmentId");
  const videoIntroduction = watch("videoIntroduction");
  const terms = watch("terms");
  const consent = watch("consent");

  const onSubmit = (data) => {
    setFormData({ ...formData, ...data });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold">Verification</h2>

      {/* Government ID */}
      <label className="flex justify-between p-4 border rounded-xl cursor-pointer">
        <span>Upload Government ID</span>
        <span>{governmentId?.name || "Choose File"}</span>
        <input
          type="file"
          hidden
          onChange={(e) =>
            setValue("governmentId", e.target.files[0])
          }
        />
      </label>
      <p className="text-red-500 text-sm">
        {errors.governmentId?.message}
      </p>

      {/* Video */}
      <label className="flex justify-between p-4 border rounded-xl cursor-pointer">
        <span>Upload Introduction Video</span>
        <span>{videoIntroduction?.name || "Choose File"}</span>
        <input
          type="file"
          hidden
          onChange={(e) =>
            setValue("videoIntroduction", e.target.files[0])
          }
        />
      </label>
      <p className="text-red-500 text-sm">
        {errors.videoIntroduction?.message}
      </p>

      {/* Checkboxes */}
      <label className="flex gap-3">
        <input
          type="checkbox"
          checked={terms || false}
          onChange={() => setValue("terms", !terms)}
        />
        Accept Terms
      </label>
      <p className="text-red-500 text-sm">
        {errors.terms?.message}
      </p>

      <label className="flex gap-3">
        <input
          type="checkbox"
          checked={consent || false}
          onChange={() => setValue("consent", !consent)}
        />
        Consent Verification
      </label>
      <p className="text-red-500 text-sm">
        {errors.consent?.message}
      </p>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={prev} className="btn-secondary">
          ← Back
        </button>

        <button className="btn-primary">
          Preview →
        </button>
      </div>
    </form>
  );
}
