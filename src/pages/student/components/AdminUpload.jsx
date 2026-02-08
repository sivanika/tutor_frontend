export default function AdminUpload({ formData, setFormData }) {
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      studentPhoto: file,
    });
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      studentDocument: file,
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload Student Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Upload Student Document
        </label>
        <input
          type="file"
          onChange={handleDocChange}
          className="border p-2 w-full rounded"
        />
      </div>
    </div>
  );
}
