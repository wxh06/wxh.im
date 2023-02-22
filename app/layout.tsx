import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
