export default function StepProgress({ currentStep }) {
  const steps = ["Student","Parent","School","Availability","Subscription"];
  return (
    <div className="flex justify-between mb-8">
      {steps.map((s,i)=>(
        <div key={s} className={`flex-1 text-center font-semibold
          ${currentStep>=i+1?"text-primary":"text-gray-400"}`}>
          {i+1}. {s}
        </div>
      ))}
    </div>
  );
}
