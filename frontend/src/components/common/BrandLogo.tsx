import Image from 'next/image';
import { BRAND } from '@/config/data';

interface BrandLogoProps {
  size?: number;
  alt?: string;
}

export default function BrandLogo({ size = 36, alt = BRAND.fullName }: BrandLogoProps) {
  return (
    <Image
      src={BRAND.logo}
      alt={alt}
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
}
