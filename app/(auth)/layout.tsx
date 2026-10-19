import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "YoSpaces",
    description: "Register your account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (<>{children}</>);
}