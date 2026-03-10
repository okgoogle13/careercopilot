import type { PropsWithChildren } from 'react';

interface PlacardProps extends PropsWithChildren {
  title: string;
}

export function Placard({ title, children }: PlacardProps) {
  return (
    <article className="placard">
      <h1 className="placard__title">{title}</h1>
      <div className="placard__body">{children}</div>
    </article>
  );
}
