export default function SchoolInfo() {
  return (
    <>
      <h2 className="text-primary text-xl mb-5 pb-2 border-b">
        School Verification
      </h2>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <input className="input" placeholder="School Email Address" />
        <input className="input" placeholder="Student ID Number" />
      </div>

      <label className="flex items-center gap-2 mb-8">
        <input type="checkbox" />
        I authorize school verification
      </label>
    </>
  );
}
