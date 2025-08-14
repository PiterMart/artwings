import localFont from "next/font/local";
import "./styles/globals.css";
import Nav from "./components/nav";
import Footer from "./components/Footer";
import LoadingProvider from "./components/LoadingProvider";
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
})

const geistSans = localFont({
  src: "./assets/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./assets/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const minecraftRegular = localFont({
  src: "../../public/fonts/MinecraftRegular-Bmg3.otf",
  variable: "--font-minecraft-regular",
});

const minecraftItalic = localFont({
  src: "../../public/fonts/MinecraftItalic-R8Mo.otf",
  variable: "--font-minecraft-italic",
});

const lovelt = localFont({
  src: "../../public/fonts/Lovelt__.ttf",
  variable: "--font-lovelt",
});

export const metadata = {
  title: "Artwings",
  description: " Committed to advancing the appreciation of contemporary art through a dynamic and historically rooted aesthetic. ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${minecraftRegular.variable} ${minecraftItalic.variable} ${lovelt.variable} ${inter.className}`}
        style={{
          backgroundImage: 'url(/backgroundtexture.jpg)',
          backgroundSize: 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <LoadingProvider>
          <Nav/>
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer/>
        </LoadingProvider>
      </body>
    </html>
  );
}
