"use client";

import React, { useState, useEffect, useRef, ReactNode, HTMLAttributes } from 'react';

/**
 * Interface untuk properti komponen Magnet.
 */
interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  /** Elemen anak yang akan diberi efek magnetik */
  children: ReactNode;
  /** Jarak jangkauan/area sensitivitas magnet dalam piksel (default: 100) */
  padding?: number;
  /** Status penonaktifan efek magnet (default: false) */
  disabled?: boolean;
  /** Kekuatan tarik magnet. Semakin besar nilainya, gerakan pergeseran semakin halus/kecil (default: 2) */
  magnetStrength?: number;
  /** Efek transisi CSS saat kursor berada dalam area jangkauan magnet (default: 'transform 0.3s ease-out') */
  activeTransition?: string;
  /** Efek transisi CSS saat kursor keluar dari area jangkauan magnet (default: 'transform 0.5s ease-in-out') */
  inactiveTransition?: string;
  /** Class CSS opsional untuk elemen pembungkus luar (wrapper) */
  wrapperClassName?: string;
  /** Class CSS opsional untuk elemen dalam yang bergerak */
  innerClassName?: string;
}

/**
 * Komponen Magnet untuk memberikan efek interaktif di mana elemen anak bergerak mengikuti kursor mouse
 * ketika kursor mendekati posisi elemen tersebut.
 */
const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  // Menyimpan status apakah kursor berada dalam jangkauan magnet
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Menyimpan posisi offset (x, y) untuk transformasi gerakan elemen
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Referensi DOM ke elemen pembungkus untuk menghitung posisi dan batas ukuran
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Jika efek magnet nonaktif, kembalikan posisi ke semula
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    /**
     * Handler event pergerakan mouse untuk menghitung jarak kursor ke pusat elemen
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;

      // Ambil posisi batas dan ukuran elemen relatif terhadap viewport
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      
      // Hitung koordinat pusat elemen
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Menghitung jarak absolut antara kursor mouse dan titik pusat elemen
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      // Cek apakah kursor berada di dalam area sensitivitas magnet (ukuran elemen + padding)
      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        // Hitung pergeseran posisi (offset) berdasarkan kekuatan magnet
        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        // Jika kursor berada di luar jangkauan, matikan magnet dan kembalikan posisi ke titik awal
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    // Pasang listener pergerakan mouse pada window
    window.addEventListener('mousemove', handleMouseMove);
    
    // Bersihkan listener saat komponen di-unmount atau nilai dependensi berubah
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, disabled, magnetStrength]);

  // Menentukan durasi/tipe transisi berdasarkan status aktif magnet
  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      {/* Elemen bagian dalam yang akan digerakkan dengan translate3d */}
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
