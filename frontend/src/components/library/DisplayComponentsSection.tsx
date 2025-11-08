import { Warning as AlertTriangle, Info } from '@mui/icons-material';
import { Box } from '@mui/material';

import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

import { ComponentDemo, ComponentSection } from './ComponentDemo';

export function DisplayComponentsSection() {
  return (
    <ComponentSection
      title="Display Components"
      description="Components for displaying information, status, and visual elements"
    >
      <ComponentDemo title="Badges">
        <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge sx={{
      bgcolor: "red.500",
      color: "common.white"
    }}>Destructive</Badge>
          <Badge sx={{
      border: 1,
      borderColor: "gray.300",
      bgcolor: "transparent"
    }}>Outline</Badge>
          <Badge sx={{
      bgcolor: "green.500"
    }}>Custom Green</Badge>
          <Badge sx={{}}>Primary</Badge>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Progress & Avatars">
        <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
          <div sx={{}}>
            <div>
              <Label>Progress Indicators</Label>
              <div sx={{
      mt: 2
    }}>
                <div>
                  <Progress value={33} sx={{
      width: "100%"
    }} />
                  <p sx={{
      typography: "body1",
      mt: 1
    }}>33% Complete</p>
                </div>
                <div>
                  <Progress value={66} sx={{
      width: "100%"
    }} />
                  <p sx={{
      typography: "body1",
      mt: 1
    }}>66% Complete</p>
                </div>
                <div>
                  <Progress value={100} sx={{
      width: "100%"
    }} />
                  <p sx={{
      typography: "body1",
      mt: 1
    }}>100% Complete</p>
                </div>
              </div>
            </div>
          </div>
          <div sx={{}}>
            <Label>Avatars</Label>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>ND</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback sx={{}}>CD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Alerts">
        <div sx={{}}>
          <Alert>
            <Info sx={{}} />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert with additional details.
            </AlertDescription>
          </Alert>
          <Alert sx={{
      border: 1,
      borderColor: "red.300",
      bgcolor: "red.50"
    }}>
            <AlertTriangle sx={{}} />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
          </Alert>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
