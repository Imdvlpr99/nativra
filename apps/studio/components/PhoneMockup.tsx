'use client';

import React from 'react';
import { PreviewCanvas, type PreviewCanvasProps } from './PreviewCanvas';

export type PhoneMockupProps = PreviewCanvasProps;

/**
 * Clean Canvas Preview component.
 * Replaces heavy physical phone frame with an expansive, responsive visual canvas.
 */
export function PhoneMockup(props: PhoneMockupProps) {
  return <PreviewCanvas {...props} />;
}
