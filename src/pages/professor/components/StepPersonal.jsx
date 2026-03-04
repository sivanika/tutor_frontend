import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalSchema } from "../validation/schemas";

export default function StepPersonal({ formData, setFormData, next }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    setFormData({ ...formData, ...data });
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-6">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <input
            className="opt-input"
            placeholder="First Name"
            {...register("firstName")}
          />
          <p className="text-red-500 text-sm">
            {errors.firstName?.message}
          </p>
        </div>

        <div>
          <input
            className="opt-input"
            placeholder="Last Name"
            {...register("lastName")}
          />
          <p className="text-red-500 text-sm">
            {errors.lastName?.message}
          </p>
        </div>

        <div>
          <input
            className="opt-input"
            placeholder="Email"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <input
            className="opt-input"
            placeholder="Phone"
            {...register("phone")}
          />
          <p className="text-red-500 text-sm">
            {errors.phone?.message}
          </p>
        </div>

        <div>
          <select className="opt-input" {...register("country")}>
            <option value="">Select Country</option>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
          </select>
          <p className="text-red-500 text-sm">
            {errors.country?.message}
          </p>
        </div>

        <div>
          <select className="opt-input" {...register("timezone")}>
            <option value="">Select Timezone</option>
            <option>IST</option>
            <option>EST</option>
            <option>PST</option>
          </select>
          <p className="text-red-500 text-sm">
            {errors.timezone?.message}
          </p>
        </div>
      </div>

      <textarea
        className="opt-input mt-6"
        rows="4"
        placeholder="Professional Bio"
        {...register("bio")}
      />
      <p className="text-red-500 text-sm">
        {errors.bio?.message}
      </p>

      <label className="mt-6 flex justify-between p-4 border rounded-xl cursor-pointer">
        <span>Upload Profile Photo</span>
        <input
          type="file"
          hidden
          onChange={(e) =>
            setValue("profilePhoto", e.target.files[0])
          }
        />
      </label>
      <p className="text-red-500 text-sm">
        {errors.profilePhoto?.message}
      </p>

      <div className="flex justify-end mt-8">
        <button className="btn-primary">Next →</button>
      </div>
    </form>
  );
}
