import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TOTPGenerator = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const validateTOTP = async () => {
    try {
      const response = await axios.post("/api/validate-totp/", { email, code });
      if (response.data.message === "TOTP code is valid") {
        toast.success("TOTP code is valid!");
      } else {
        toast.error("Invalid TOTP code");
      }
    } catch (error) {
      toast.error("Failed to validate TOTP");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Validate TOTP</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">TOTP Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          onClick={validateTOTP}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Validate
        </button>
      </div>
    </div>
  );
};

export default TOTPGenerator;