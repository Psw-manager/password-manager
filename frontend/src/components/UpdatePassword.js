import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePassword = ({ passwordId, initialData, onClose }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData,
  });

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/password/${passwordId}/update/`, data, {
        withCredentials: true,
      });
      toast.success("Password updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Update Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold">Website Name</label>
          <input
            {...register("website_name")}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Website URL</label>
          <input
            {...register("website_url")}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;