import { Check, Visibility, Star } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';

import { Badge } from '../ui/badge';

interface TemplateCardProps {
  template_name: string;
  ats_score: number;
  preview_image?: string;
  is_recommended?: boolean;
  is_selected?: boolean;
  best_for_tags?: string[];
  onSelect?: () => void;
  onPreview?: () => void;
}

export function TemplateCard({
  template_name,
  ats_score,
  preview_image,
  is_recommended = false,
  is_selected = false,
  best_for_tags = [],
  onSelect,
  onPreview,
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-accent-green';
    if (score >= 90) return 'text-brand-light';
    if (score >= 85) return 'text-accent-orange';
    return 'text-content-muted';
  };

  return (
    <Card
      sx={{
      overflow: "hidden",
      cursor: "pointer",
      '&:hover': {},}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Recommended Badge */}
      {is_recommended && (
        <div sx={{}}>
          <Badge sx={{
      color: "common.white",
      gap: 1,
      boxShadow: 4,
      fontWeight: 600
    }}>
            <Star sx={{}} />
            Recommended
          </Badge>
        </div>
      )}

      {/* Selection Indicator */}
      {is_selected && (
        <div sx={{}}>
          <div sx={{
      borderRadius: "var(--sys-shape-radius-full)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: 4
    }}>
            <Check sx={{
      color: "common.white"
    }} />
          </div>
        </div>
      )}

      {/* Preview Image */}
      <div sx={{
      overflow: "hidden",}}>
        {preview_image ? (
          <img
            src={preview_image}
            alt={`${template_name} preview`}
            sx={{
      width: "100%",
      height: "100%",}}
          />
        ) : (
          <div sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",}}>
            <div sx={{}}>
              <Visibility sx={{
      mb: 2,
      opacity: 0.5
    }} />
              <p sx={{
      typography: "body1"
    }}>Preview</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          sx={{
      bgcolor: "common.black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",}}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.();
            }}
            sx={{
      color: "common.white",
      '&:hover': {},
      '&:hover': { color: "common.white" },
      fontWeight: 600
    }}
          >
            <Visibility sx={{
      mr: 2
    }} />
            Preview
          </Button>
        </div>
      </div>

      {/* Content */}
      <div sx={{
      p: 6,}}>
        <div sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }}>
          <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>
            {template_name}
          </h3>
          <div sx={{
      textAlign: "right"
    }}>
            <div sx={{
      typography: "h5",
      fontWeight: 700,}}>{ats_score}%</div>
            <div sx={{
      typography: "body2",}}>ATS Score</div>
          </div>
        </div>

        {/* Tags */}
        {best_for_tags.length > 0 && (
          <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
            {best_for_tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                sx={{
      typography: "body2",
      '&:hover': {},
      '&:hover': {},
      px: 2,
      py: 1
    }}
              >
                {tag}
              </Badge>
            ))}
            {best_for_tags.length > 3 && (
              <Badge
                variant="outline"
                sx={{
      typography: "body2",
      px: 2,
      py: 1
    }}
              >
                +{best_for_tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          sx={{
      width: "100%",
      fontWeight: 600,
      borderRadius: "1.5rem",
      py: 3,
      '&:hover': {},
      '&:hover': {},}}
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
        >
          {is_selected ? 'Selected' : 'Select Template'}
        </Button>
      </div>
    </Card>
  );
}
