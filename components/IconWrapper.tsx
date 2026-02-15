
import React from 'react';

interface IconWrapperProps {
  icon: React.ElementType;
  className?: string;
  size?: number;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, className = '', size = 16 }) => {
  return <Icon className={className} style={{ width: size, height: size }} />;
};

export default IconWrapper;
