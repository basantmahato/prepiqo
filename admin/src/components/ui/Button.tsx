import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const rootClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;
  return <button className={rootClass} {...props} />;
};
