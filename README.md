# SDK Mdk Integration Guide

## 1. Introduction

The **Mdk** SDK provides functionalities to support user authentication using JWT tokens. This SDK is designed to integrate with React applications, enabling you to manage login sessions, validate tokens, and handle user logout.

---

## 2. Installation

1. Install the `@interlinklabs/mdk` library:

   ```bash
   npm install @interlinklabs/mdk
   ```

2. Import the **Mdk** SDK into your project from the corresponding file.

---

## 3. Using the SDK

### 3.1. Configuring Mdk

Integrate the SDK by using the `Mdk` component in your application.

```tsx
import React from "react";
import Mdk from "@interlinklabs/mdk";

const App = () => {
  const handleSuccess = () => {
    console.log("Login successful!");
  };

  const handleFailure = () => {
    console.log("Login failed.");
  };

  return (
    <Mdk
      appid="your-app-id"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
    >
      {({ open }) => <button onClick={open}>Login with the app</button>}
    </Mdk>
  );
};

export default App;
```

#### Mdk Properties:

- `appid` (string): Your application ID for identification.
- `onSuccess` (function): A callback function triggered upon successful login.
- `onFailure` (function): A callback function triggered upon login failure.
- `children` (function): Renders UI components with the `{ open }` property to initiate the login process.

---

### 3.2. Mdk Methods

#### 1. `Mdk.getLoginId()`

- **Description**: Retrieves the loginId from the JWT stored in cookies.
- **Usage**:
  ```tsx
  const loginId = Mdk.getLoginId("your-app-id");
  console.log("Login ID:", loginId);
  ```

#### 2. `Mdk.getUserName()`

- **Description**: Fetches the username associated with a given loginId.
- **Usage**:
  ```tsx
  const username = await Mdk.getUserName("your-app-id");
  console.log("Username:", username);
  ```

#### 3. `Mdk.logOut()`

- **Description**: Deletes the JWT token and logs out the user.
- **Usage**:
  ```tsx
  Mdk.logOut("your-app-id");
  console.log("Logged out!");
  ```

---

### 3.3. Workflow

1. Login Request: The user clicks the login button (triggered by the open method).
2. Message Sent: A message containing the appid is sent to the native app.
3. Native App Response: The native app responds with the status (pass or fail).
4. Token Validation: The SDK validates the JWT token:
   - If valid: The token is stored in cookies, and the onSuccess function is called.
   - If invalid: The token is deleted, and the onFailure function is called.

---

## 4. Sample Application

A sample application demonstrating the integration of the Mdk SDK is available on GitHub: [AimShoota](https://github.com/MNgaminhhh/AimShoota).
