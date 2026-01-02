import "@/app/css/globals.css";
import "@/app/css/components.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>{children}</>
  );
}
