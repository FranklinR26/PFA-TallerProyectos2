/**
 * LogoUC — Logo oficial Universidad Continental
 *
 * Props:
 *   variant  "dark" | "light"   dark = ícono negro + texto negro (fondos blancos)
 *                                light = ícono blanco + texto blanco (fondos oscuros)
 *   size     "sm" | "md" | "lg" controla la altura del ícono
 *   iconOnly  boolean            solo muestra el ícono sin texto
 */
export default function LogoUC({ variant = 'dark', size = 'md', iconOnly = false }) {
  const heights = { sm: 28, md: 36, lg: 52 };
  const h = heights[size] ?? 36;

  const textColor = variant === 'light' ? '#ffffff' : '#1a1a1a';
  // El archivo es el ícono oscuro; en variante light lo invertimos a blanco
  const iconFilter = variant === 'light' ? 'brightness(0) invert(1)' : 'none';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: h * 0.36, flexShrink: 0 }}>
      <img
        src="/uc-icon.webp"
        alt="Universidad Continental"
        height={h}
        width={h}
        style={{
          objectFit: 'contain',
          filter: iconFilter,
          display: 'block',
        }}
      />
      {!iconOnly && (
        <div style={{
          display: 'flex', flexDirection: 'column',
          lineHeight: 1.15,
          userSelect: 'none',
        }}>
          <span style={{
            fontWeight: 700,
            fontSize: h * 0.44,
            color: textColor,
            letterSpacing: '-0.02em',
          }}>
            Universidad
          </span>
          <span style={{
            fontWeight: 700,
            fontSize: h * 0.44,
            color: textColor,
            letterSpacing: '-0.02em',
          }}>
            Continental
          </span>
        </div>
      )}
    </div>
  );
}
