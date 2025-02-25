export const validateToken = async (
  token: string,
  appId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      "https://interlink-mini-app.interlinklabs.ai/api/tracking/validate-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, appId }),
      }
    );

    if (!response.ok) {
      console.error(`API responded with status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const getUserName = async (loginId: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://interlink-mini-app.interlinklabs.ai/api/tracking/profile/${loginId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error(`API responded with status ${response.status}`);
      return null;
    }

    const data = await response.json();

    return data?.data?.username || null;
  } catch (error) {
    console.error("Error fetching username:", error);
    return null;
  }
};
