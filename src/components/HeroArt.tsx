import "./HeroArt.css";
import layers from "../hero/hero.layers.json";

type Layer = {
  id: string;
  name: string;
  src: string;
  alt: string;
  z: number;
  x: string;
  y: string;
  w: string;
  opacity: number;
  blend: string;
  rotate: string;
};

export default function HeroArt() {
  const ordered = [...(layers as Layer[])].sort((a, b) => a.z - b.z);

  return (
    <div className="hero-art" aria-hidden="true">
      {ordered.map((layer) => (
        <img
          key={layer.id}
          className={`hero-art__layer hero-art__layer--${layer.name}`}
          src={layer.src}
          alt={layer.alt}
          style={{
            zIndex: layer.z,
            left: layer.x,
            top: layer.y,
            width: layer.w,
            opacity: layer.opacity,
            mixBlendMode: layer.blend as React.CSSProperties["mixBlendMode"],
            transform: `rotate(${layer.rotate})`,
          }}
        />
      ))}
    </div>
  );
}
