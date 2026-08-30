import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size = 20, ...props }) => {
  // Get icon by PascalCase name
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name] || Icons.Calculator;

  return <IconComponent className={className} size={size} {...props} />;
};
