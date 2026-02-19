import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "L'Atelier d'Écriture",
  description: "Votre voyage vers la maîtrise commence ici.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
