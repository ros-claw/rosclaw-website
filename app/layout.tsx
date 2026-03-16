import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ROSClaw - Software-Defined Embodied AI',
  description: 'The AUTOSAR + Android for the robotics industry. ROSClaw unifies hardware morphologies, algorithms, and data formats into a single, scalable Operating System.',
  keywords: ['ROS', 'robotics', 'AI', 'LLM', 'embodied AI', 'operating system', 'ROS 2'],
  authors: [{ name: 'ROSClaw Team' }],
  openGraph: {
    title: 'ROSClaw - Software-Defined Embodied AI',
    description: 'The AUTOSAR + Android for the robotics industry.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[#050505] text-white antialiased">{children}</body>
    </html>
  );
}
