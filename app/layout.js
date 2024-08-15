import Navigation from "./components/Navigation";

export const metadata = {
  title: "The Wild Oasis",
  description: "Welcome to Paradise!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
      <footer>Copyright &copy;2024 The Wild Oasis LLC</footer>
    </html>
  );
}
