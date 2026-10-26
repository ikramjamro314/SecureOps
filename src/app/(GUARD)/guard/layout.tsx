import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../../app/globals.css";
import Provider from "../../../utils/Provider"
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
  title: "Guard Dashboard",
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
      name: "Demo Guard",
      email: "guard@secureops.demo",
      image: "/assets/logo.png",
      role: "GUARD",
      id: "demo-guard-id",
      verified: true,
    },
    expires: "9999-12-31T23:59:59.999Z",
  };
  const smallCase = "guard";
  const data = {
    link: [
      {
        href: `${smallCase}/dashboard`,
      },
      {
        href: `${smallCase}/register`,

      },
      {
        href: `${smallCase}/alerts`,
      },
      {
        href: `${smallCase}/chats`,

      }
    ],
    value: [
      {
        value: "Duty Dashboard",
      }, {
        value: "Register",
      },
      {
        value: "Alerts",
      },
      {
        value: "Chats",
      }
    ],
  }
  return (
    <div className="min-h-screen">
      <Provider session={session}>
        <Navbar data={data} />
        {children}
      </Provider>
    </div>
  );
}

