import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  deleteCookie,
  getCookie,
  getUserName,
  setCookie,
  validateToken,
} from "../helpers";
import { MdkProps } from "../types";

const Mdk = (props: MdkProps) => {
  const { appid, onSuccess, onFailure, children } = props;
  const [isSuccessful, setIsSuccessful] = useState(false);

  // open => handle check login
  const handleLoginClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (window?.ReactNativeWebView) {
      const message = JSON.stringify({ action: "pass", appid });
      window.ReactNativeWebView.postMessage(message);
    }
  };

  // validate token and set cookie to webapp
  const checkStoredToken = async (message?: { token: string }) => {
    let storedToken = getCookie(`jwt_${appid}`);

    if (!storedToken && message?.token) {
      storedToken = message.token;
    }
    if (storedToken) {
      const isValid = await validateToken(storedToken, appid);
      if (isValid) {
        setCookie(`jwt_${appid}`, storedToken, 1);
        setIsSuccessful(true);
        onSuccess();
        return;
      } else {
        deleteCookie(`jwt_${appid}`);
      }
    }

    setIsSuccessful(false);
  };

  // check response from app to webapp
  const handleResponse = async (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    if (message.action === "pass") {
      await checkStoredToken(message);
    } else if (message.action === "fail") {
      onFailure();
    }
  };

  useEffect(() => {
    checkStoredToken();

    window.addEventListener("message", handleResponse);

    return () => {
      window.removeEventListener("message", handleResponse);
    };
  }, [appid, onSuccess, onFailure]);

  if (isSuccessful) {
    return null;
  }

  return <>{children({ open: handleLoginClick })}</>;
};

// get login id from interlink app => Mdk.getLoginId()
Mdk.getLoginId = (appid: string): string | null => {
  const storedToken = getCookie(`jwt_${appid}`);
  if (!storedToken) return null;

  try {
    const decoded: { loginId?: string } = jwtDecode(storedToken);
    return decoded?.loginId || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

Mdk.getUserName = async (appid: string): Promise<string | null> => {
  const storedToken = getCookie(`jwt_${appid}`);
  if (!storedToken) return null;

  try {
    const decoded: { loginId?: string } = jwtDecode(storedToken);

    if (decoded.loginId) {
      try {
        const response = await fetch(
          `https://interlink-mini-app.interlinklabs.ai/api/tracking/profile/${decoded.loginId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          console.error(`lỗi`);
          return null;
        }

        const data = await response.json();
        return data?.data?.username || null;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin username:", error);
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return null;
  }
};

// log out => Mdk.logOut()
Mdk.logOut = (appid: string): void => {
  deleteCookie(`jwt_${appid}`);
};
export default Mdk;
