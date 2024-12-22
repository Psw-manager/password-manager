const API_BASE_URL = "http://localhost:8000/api";

export type Password = {
  id: string;
  site_name: string;
  username: string;
  category: string;
  site_url: string;
  password: string;
  creation_date: string;
  modification_date: string;
  notes: string;
};

export const fetchRefreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Unable to refresh token");
    }

    const data = await response.json();

    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const fetchPasswords = async (email: string | undefined | null): Promise<Password[]> => {
  if (email === undefined) {
    console.error("Error: email is required");
    return []; 
  }
  try {
    const response = await fetch(`http://localhost:8000/api/passwords/details?email=${email}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data: Password[] = await response.json();

    console.log('Passwords:', data);
    return data;

  } catch (error) {
    console.error('Error fetching passwords:', error);
    return []; 
  }
};