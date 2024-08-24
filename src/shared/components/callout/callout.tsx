import { CircleCheckBig, Info, TriangleAlert } from 'lucide-react';
import React from 'react';

type ColorType =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

interface CalloutProps extends React.PropsWithChildren {
  color?: ColorType;
  icon?: React.ReactNode;
  className?: string;
}

const Callout: React.FC<CalloutProps> = ({
  children,
  color = 'default',
  icon,
  className = '',
}) => {
  const typeStyles = React.useMemo(() => {
    const key = color;
    switch (key) {
      case 'default':
        return 'bg-[#fff8dc] border-default text-default';
      case 'primary':
        return 'bg-primary/20 border-primary text-primary';
      case 'secondary':
        return 'bg-secondary/20 border-secondary text-secondary';
      case 'success':
        return 'bg-success/20 border-success text-success';
      case 'warning':
        return 'bg-warning/20 border-warning text-warning';
      case 'danger':
        return 'bg-danger/20 border-danger text-danger';
      default:
        return 'bg-[#fff8dc] border-default text-default';
    }
  }, [color]);

  const typeIcon = React.useMemo(() => {
    const key = icon || color;
    switch (key) {
      case 'default':
        return <Info className="text-[#4c3101]" style={{ color: '#4c3101' }} />;
      case 'primary':
        return <Info />;
      case 'secondary':
        return <Info />;
      case 'success':
        return <CircleCheckBig />;
      case 'warning':
        return <TriangleAlert />;
      case 'danger':
        return <TriangleAlert />;
      default:
        return <Info className="text-[#4c3101]" />;
    }
  }, [icon, color]);

  return (
    <div
      className={`box-border w-full border-1 p-4 rounded-lg ${typeStyles} ${className}`}
      role="alert"
      style={{
        backgroundColor: 'rgba(255, 248, 220, 0.5)',
      }}
    >
      <div className="flex gap-4">
        {typeIcon}
        {children}
      </div>
    </div>
  );
};

export default Callout;
