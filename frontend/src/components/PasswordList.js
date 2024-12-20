import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PasswordList = () => {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const response = await axios.get("/api/passwords", { withCredentials: true });
      setPasswords(response.data);
    } catch (error) {
      toast.error("Failed to fetch passwords");
    }
  };

  const deletePassword = async (passwordId) => {
    try {
      await axios.delete(`/api/passwords/delete/`, {
        data: { password_ids: [passwordId] },
        withCredentials: true,
      });
      toast.success("Password deleted successfully!");
      fetchPasswords();
    } catch (error) {
      toast.error("Failed to delete password");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Passwords</h1>
      {passwords.map((password) => (
        <div key={password.id} className="flex items-center justify-between p-4 border-b">
          <div>
            <p className="font-semibold">{password.website_name}</p>
            <p>{password.website_url}</p>
            <p>{password.password}</p>
          </div>
          <div>
            <button
              onClick={() => deletePassword(password.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordList;