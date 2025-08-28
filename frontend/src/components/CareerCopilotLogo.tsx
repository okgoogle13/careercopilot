interface CareerCopilotLogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'compact';
}

export function CareerCopilotLogo({ className = "", size = 32, variant = 'full' }: CareerCopilotLogoProps) {
  if (variant === 'compact') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Black background circle */}
        <circle cx="12" cy="12" r="12" fill="#000000" />
        
        {/* Crossbones */}
        <g fill="#ffffff">
          {/* First crossbone */}
          <path d="M4 8L20 16L18 18L2 10L4 8Z" />
          <circle cx="3" cy="9" r="1.5" />
          <circle cx="19" cy="17" r="1.5" />
          
          {/* Second crossbone */}
          <path d="M20 8L4 16L2 14L18 6L20 8Z" />
          <circle cx="19" cy="7" r="1.5" />
          <circle cx="3" cy="15" r="1.5" />
        </g>
        
        {/* Skull */}
        <g fill="#ffffff">
          {/* Skull outline */}
          <path d="M8 6C8 4 10 2 12 2C14 2 16 4 16 6V10C16 12 14 14 12 14C10 14 8 12 8 10V6Z" />
          
          {/* Eye sockets */}
          <circle cx="10" cy="8" r="1" fill="#000000" />
          <circle cx="14" cy="8" r="1" fill="#000000" />
          
          {/* Nasal cavity */}
          <path d="M12 10L11 12L13 12L12 10Z" fill="#000000" />
        </g>
      </svg>
    );
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Black background circle */}
      <circle cx="16" cy="16" r="16" fill="#000000" />
      
      {/* Crossbones */}
      <g fill="#ffffff">
        {/* First crossbone - diagonal */}
        <path d="M6 10L26 22L24 24L4 12L6 10Z" />
        <circle cx="5" cy="11" r="2" />
        <circle cx="25" cy="23" r="2" />
        <circle cx="7" cy="9" r="1" />
        <circle cx="27" cy="21" r="1" />
        
        {/* Second crossbone - other diagonal */}
        <path d="M26 10L6 22L4 20L24 8L26 10Z" />
        <circle cx="25" cy="9" r="2" />
        <circle cx="5" cy="21" r="2" />
        <circle cx="27" cy="11" r="1" />
        <circle cx="7" cy="23" r="1" />
      </g>
      
      {/* Skull */}
      <g fill="#ffffff">
        {/* Main skull shape */}
        <path d="M12 8C12 6 13.5 4 16 4C18.5 4 20 6 20 8V14C20 16.5 18.5 18 16 18C13.5 18 12 16.5 12 14V8Z" />
        
        {/* Eye sockets */}
        <circle cx="14" cy="11" r="1.5" fill="#000000" />
        <circle cx="18" cy="11" r="1.5" fill="#000000" />
        
        {/* Nasal cavity */}
        <path d="M16 13L15 16L17 16L16 13Z" fill="#000000" />
        
        {/* Jaw/teeth */}
        <rect x="14.5" y="16" width="0.5" height="1.5" fill="#000000" />
        <rect x="15.5" y="16" width="0.5" height="1.5" fill="#000000" />
        <rect x="16.5" y="16" width="0.5" height="1.5" fill="#000000" />
      </g>
    </svg>
  );
}