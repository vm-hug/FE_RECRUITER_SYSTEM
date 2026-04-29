import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <main className="auth-layout">{children}</main>;
};

export default AuthLayout;
