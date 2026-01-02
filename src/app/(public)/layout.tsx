import "@/app/css/globals.css";
import "@/app/css/components.css";
import Header from "../reusables/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
