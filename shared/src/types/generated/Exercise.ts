/* eslint-disable */
/* tslint:disable */

export interface ExerciseCardImage {
  description?: string;
  source?: string;
}

export interface ExerciseCard {
  image?: ExerciseCardImage;
}

export type ExerciseThemeTextColorOptions = '#F9F8F4' | '#2E2E2E';

export interface ExerciseTheme {
  textColor?: ExerciseThemeTextColorOptions;
  backgroundColor?: string;
}

export interface ExerciseIntroPortalVideoLoop {
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseIntroPortalVideoEnd {
  description?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseIntroPortalHostNote {
  text: string;
}

export interface ExerciseIntroPortal {
  videoLoop?: ExerciseIntroPortalVideoLoop;
  videoEnd?: ExerciseIntroPortalVideoEnd;
  hostNotes?: ExerciseIntroPortalHostNote[];
}

export interface ExerciseOutroPortalVideo {
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseOutroPortal {
  video?: ExerciseOutroPortalVideo;
}

export interface ExerciseSlideContentSlideHostNote {
  text: string;
}

export interface ExerciseSlideContentSlideContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideContentSlideContentVideo {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlideContentSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  duration?: number;
  audio?: string;
}

export interface ExerciseSlideContentSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideContentSlideContentImage;
  video?: ExerciseSlideContentSlideContentVideo;
  lottie?: ExerciseSlideContentSlideContentLottie;
}

export interface ExerciseSlideReflectionSlideHostNote {
  text: string;
}

export interface ExerciseSlideReflectionSlideContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideReflectionSlideContentVideo {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlideReflectionSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  duration?: number;
  audio?: string;
}

export interface ExerciseSlideReflectionSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideReflectionSlideContentImage;
  video?: ExerciseSlideReflectionSlideContentVideo;
  lottie?: ExerciseSlideReflectionSlideContentLottie;
}

export interface ExerciseSlideSharingSlideHostNote {
  text: string;
}

export interface ExerciseSlideSharingSlideContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideSharingSlideContentVideo {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlideSharingSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  duration?: number;
  audio?: string;
}

export interface ExerciseSlideSharingSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideSharingSlideContentImage;
  video?: ExerciseSlideSharingSlideContentVideo;
  lottie?: ExerciseSlideSharingSlideContentLottie;
}

export interface ExerciseSlideHostSlideHostNote {
  text: string;
}

export interface ExerciseSlideContentSlide {
  type: 'content';
  hostNotes?: ExerciseSlideContentSlideHostNote[];
  content?: ExerciseSlideContentSlideContent;
}

export interface ExerciseSlideReflectionSlide {
  type: 'reflection';
  hostNotes?: ExerciseSlideReflectionSlideHostNote[];
  content?: ExerciseSlideReflectionSlideContent;
}

export interface ExerciseSlideSharingSlide {
  type: 'sharing';
  hostNotes?: ExerciseSlideSharingSlideHostNote[];
  content?: ExerciseSlideSharingSlideContent;
}

export interface ExerciseSlideHostSlide {
  type: 'host';
  hostNotes?: ExerciseSlideHostSlideHostNote[];
}

export interface Exercise {
  id: any;
  name: string;
  duration: number;
  published: boolean;
  hidden?: boolean;
  card: ExerciseCard;
  theme?: ExerciseTheme;
  introPortal?: ExerciseIntroPortal;
  outroPortal?: ExerciseOutroPortal;
  slides: (
    | ExerciseSlideContentSlide
    | ExerciseSlideReflectionSlide
    | ExerciseSlideSharingSlide
    | ExerciseSlideHostSlide
  )[];
}
