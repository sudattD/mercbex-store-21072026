import { Bug, Shield, Leaf, Rat, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bug,
  Shield,
  Leaf,
  Rat,
  TrendingUp,
};

export default function CategoryIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  const Icon = iconMap[name];
  if (!Icon) return <span>{name}</span>;
  return <Icon className={className} />;
}
