import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Provider from "../../../utils/Provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Smart security operations management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawSession = await getServerSession(authOptions);
  const session = rawSession || {
    user: {
      name: "Demo User",
      email: "darshil.xic.11@demo.com",
      image: "/assets/logo.png",
      role: "USER",
      id: "demo-user-id",
      verified: true,
    },
    expires: "9999-12-31T23:59:59.999Z",
  };
  const smallCase = "user";
  const data = {
    link: [
      {
        href: `${smallCase}/dashboard`,
      },
      {
        href: `${smallCase}/agency`,
      },
      {
        href: `${smallCase}/alert`,
      },
    ],
    value: [
      {
        value: "User's Dashboard",
      },
      {
        value: "Guards",
      },
      {
        value: "Alerts",
      },
    ],
  };
  return (
    <div className="min-h-screen">
      <Provider session={session}>
        <Navbar data={data} />
        {children}
      </Provider>
    </div>
  );
}
