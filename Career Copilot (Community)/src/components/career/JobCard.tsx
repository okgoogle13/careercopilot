import React, { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Building,
  Clock,
  DollarSign,
  Users,
  Zap,
  ExternalLink,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";
import {
  M3Card,
  M3CardHeader,
  M3CardTitle,
  M3CardDescription,
  M3CardContent,
  M3CardFooter,
} from "../ui/m3-card";
import { M3Button } from "../ui/m3-button";
import { Badge } from "../ui/badge";
import { cn, formatRelativeTime } from "../ui/utils";

export interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: "full-time" | "part-time" | "contract" | "remote" | "hybrid";
    salary?: {
      min: number;
      max: number;
      currency: string;
      period: "hourly" | "annually";
    };
    description: string;
    requirements: string[];
    skills: string[];
    benefits?: string[];
    postedDate: Date | string;
    applicationDeadline?: Date | string;
    companySize?: string;
    industry?: string;
    experienceLevel: "entry" | "mid" | "senior" | "executive";
    remote: boolean;
    sponsored?: boolean;
    verified?: boolean;
    aiMatch?: {
      score: number;
      reasons: string[];
    };
    logoUrl?: string;
  };
  variant?: "default" | "compact" | "featured";
  saved?: boolean;
  applied?: boolean;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  className?: string;
}

export function JobCard({
  job,
  variant = "default",
  saved = false,
  applied = false,
  onSave,
  onApply,
  onViewDetails,
  className,
}: JobCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(job.id);
  };

  const formatSalary = () => {
    if (!job.salary) return null;
    const { min, max, currency, period } = job.salary;
    const periodText = period === "hourly" ? "/hr" : "/year";

    if (min === max) {
      return `${currency}${min.toLocaleString()}${periodText}`;
    }
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}${periodText}`;
  };

  const getExperienceBadgeColor = () => {
    switch (job.experienceLevel) {
      case "entry":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "mid":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "senior":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "executive":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-surface-container text-on-surface border-outline-variant";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-500/10";
    if (score >= 75) return "text-blue-600 bg-blue-500/10";
    if (score >= 60) return "text-yellow-600 bg-yellow-500/10";
    return "text-red-600 bg-red-500/10";
  };

  if (variant === "compact") {
    return (
      <M3Card
        variant="interactive"
        className={cn("transition-all duration-300", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewDetails}
      >
        <M3CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground truncate">{job.title}</h3>
                {job.verified && <Shield className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-3 h-3" />
                <span className="truncate">{job.company}</span>
                <span>•</span>
                <MapPin className="w-3 h-3" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {job.aiMatch && (
                <div
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    getMatchScoreColor(job.aiMatch.score),
                  )}
                >
                  {job.aiMatch.score}% match
                </div>
              )}
              <M3Button
                variant="text"
                size="small"
                onClick={handleSave}
                icon={
                  isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />
                }
                className={cn(
                  "p-2",
                  isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              />
            </div>
          </div>
        </M3CardContent>
      </M3Card>
    );
  }

  return (
    <M3Card
      variant={variant === "featured" ? "selected" : "interactive"}
      className={cn(
        "transition-all duration-300",
        variant === "featured" && "ring-2 ring-primary/20",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <M3CardHeader>
        <div className="flex items-start justify-between mb-3">
          {/* Company Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container-high">
              {job.logoUrl ? (
                <img src={job.logoUrl} alt={job.company} className="w-8 h-8 rounded-lg" />
              ) : (
                <Building className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{job.company}</span>
                {job.verified && <Shield className="w-4 h-4 text-blue-500" />}
                {job.sponsored && (
                  <Badge variant="secondary" className="text-xs bg-tertiary/10 text-tertiary">
                    Sponsored
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {job.industry} • {job.companySize}
              </div>
            </div>
          </div>

          {/* Save Button & Match Score */}
          <div className="flex items-center gap-2">
            {job.aiMatch && (
              <div className="text-center">
                <div
                  className={cn(
                    "text-lg font-semibold px-3 py-1 rounded-lg",
                    getMatchScoreColor(job.aiMatch.score),
                  )}
                >
                  {job.aiMatch.score}%
                </div>
                <div className="text-xs text-muted-foreground">AI Match</div>
              </div>
            )}

            <M3Button
              variant="text"
              size="small"
              onClick={handleSave}
              icon={
                isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />
              }
              className={cn(
                "p-2",
                isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            />
          </div>
        </div>

        <M3CardTitle className="text-xl mb-2">{job.title}</M3CardTitle>

        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>

          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary()}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatRelativeTime(job.postedDate)}</span>
          </div>
        </div>

        <M3CardDescription className="text-sm leading-relaxed line-clamp-3">
          {job.description}
        </M3CardDescription>
      </M3CardHeader>

      <M3CardContent>
        {/* Job Type & Experience Level */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {job.type.replace("-", " ").toUpperCase()}
          </Badge>
          <Badge variant="outline" className={cn("text-xs border", getExperienceBadgeColor())}>
            {job.experienceLevel.toUpperCase()} LEVEL
          </Badge>
          {job.remote && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              REMOTE
            </Badge>
          )}
        </div>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 6).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* AI Match Reasons */}
        {job.aiMatch && job.aiMatch.reasons.length > 0 && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Why this matches you</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {job.aiMatch.reasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Deadline */}
        {job.applicationDeadline && (
          <div className="flex items-center gap-2 text-sm text-error mb-4">
            <Clock className="w-4 h-4" />
            <span>Application deadline: {formatRelativeTime(job.applicationDeadline)}</span>
          </div>
        )}
      </M3CardContent>

      <M3CardFooter className="flex gap-3">
        {applied ? (
          <M3Button
            variant="outlined"
            size="medium"
            disabled
            className="flex-1 bg-green-500/10 border-green-500/20 text-green-600"
          >
            Applied
          </M3Button>
        ) : (
          <M3Button
            variant="filled"
            size="medium"
            onClick={handleApply}
            className="flex-1"
            icon={<TrendingUp className="w-4 h-4" />}
          >
            Apply Now
          </M3Button>
        )}

        <M3Button
          variant="outlined"
          size="medium"
          onClick={handleViewDetails}
          trailingIcon={<ExternalLink className="w-4 h-4" />}
        >
          View Details
        </M3Button>
      </M3CardFooter>
    </M3Card>
  );
}
