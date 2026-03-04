import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { academicSchema } from "../validation/schemas";

export default function StepAcademic({ formData, setFormData, next, prev }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(academicSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    setFormData({ ...formData, ...data });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-6">
        Academic Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <select {...register("highestDegree")} className="opt-input">
            <option value="">Highest Degree</option>
            <option>PhD</option>
            <option>Masters</option>
            <option>Bachelors</option>
          </select>
          <p className="text-red-500 text-sm">
            {errors.highestDegree?.message}
          </p>
        </div>

        <div>
          <input
            {...register("fieldOfStudy")}
            className="opt-input"
            placeholder="Field of Study"
          />
          <p className="text-red-500 text-sm">
            {errors.fieldOfStudy?.message}
          </p>
        </div>

        <div>
          <input
            {...register("university")}
            className="opt-input"
            placeholder="University"
          />
          <p className="text-red-500 text-sm">
            {errors.university?.message}
          </p>
        </div>

        <div>
          <input
            {...register("graduationYear")}
            className="opt-input"
            placeholder="Graduation Year"
          />
          <p className="text-red-500 text-sm">
            {errors.graduationYear?.message}
          </p>
        </div>
      </div>

      <input
        {...register("specializations")}
        className="opt-input mt-6"
        placeholder="Specializations"
      />
      <p className="text-red-500 text-sm">
        {errors.specializations?.message}
      </p>

      <textarea
        {...register("certifications")}
        className="opt-input mt-6"
        placeholder="Certifications"
      />
      <p className="text-red-500 text-sm">
        {errors.certifications?.message}
      </p>

      <label className="mt-6 flex justify-between p-4 border rounded-xl cursor-pointer">
        <span>Upload Degree Certificate</span>
        <input
          type="file"
          hidden
          onChange={(e) =>
            setValue("degreeCertificate", e.target.files[0])
          }
        />
      </label>
      <p className="text-red-500 text-sm">
        {errors.degreeCertificate?.message}
      </p>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prev} className="btn-secondary">
          ← Back
        </button>

        <button className="btn-primary">
          Next →
        </button>
      </div>
    </form>
  );
}
