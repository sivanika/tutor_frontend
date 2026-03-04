import { useFormContext } from "react-hook-form";


export default function StudentInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputStyle = `
    w-full p-3 rounded-lg
    bg-slate-50 dark:bg-slate-800
    border border-slate-300 dark:border-slate-700
    text-slate-800 dark:text-slate-100
    placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-slate-500
    transition
  `;

  const errorStyle = "text-red-500 text-sm mt-1";
  const step1Fields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "birthDate",
  "gradeLevel",
  "school",
  "learningGoals",
  "subjects",
];

  return (
    <div
      className="
        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-xl
        p-8 rounded-2xl
        border border-slate-200 dark:border-slate-800
        shadow-lg dark:shadow-black/30
        transition
      "
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        Student Information
      </h2>

      {/* Name */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <input
            {...register("firstName")}
            className={inputStyle}
            placeholder="First Name"
          />
          {errors.firstName && (
            <p className={errorStyle}>{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("lastName")}
            className={inputStyle}
            placeholder="Last Name"
          />
          {errors.lastName && (
            <p className={errorStyle}>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <div>
          <input
            {...register("email")}
            className={inputStyle}
            placeholder="Email Address"
          />
          {errors.email && (
            <p className={errorStyle}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            className={inputStyle}
            placeholder="Phone Number"
          />
          {errors.phone && (
            <p className={errorStyle}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* DOB + Grade */}
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <div>
          <input
            type="date"
            {...register("birthDate")}
            className={inputStyle}
          />
          {errors.birthDate && (
            <p className={errorStyle}>{errors.birthDate.message}</p>
          )}
        </div>

        <div>
          <select
            {...register("gradeLevel")}
            className={inputStyle}
          >
            <option value="">Select Grade Level</option>
            <option>High School</option>
            <option>College</option>
          </select>
          {errors.gradeLevel && (
            <p className={errorStyle}>{errors.gradeLevel.message}</p>
          )}
        </div>
      </div>

      {/* School */}
      <div className="mt-5">
        <input
          {...register("school")}
          className={inputStyle}
          placeholder="School Name"
        />
        {errors.school && (
          <p className={errorStyle}>{errors.school.message}</p>
        )}
      </div>

      {/* Learning Goals */}
      <div className="mt-5">
        <textarea
          {...register("learningGoals")}
          className={`${inputStyle} min-h-[100px]`}
          placeholder="Learning Goals"
        />
        {errors.learningGoals && (
          <p className={errorStyle}>
            {errors.learningGoals.message}
          </p>
        )}
      </div>

      {/* Subjects */}
      <div className="mt-5">
        <textarea
          {...register("subjects")}
          className={`${inputStyle} min-h-[100px]`}
          placeholder="Subjects Needing Help"
        />
        {errors.subjects && (
          <p className={errorStyle}>{errors.subjects.message}</p>
        )}
      </div>
      
    </div>
  );
}