'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Database } from '@/types/supabase';

type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface GrowthJourneyProps {
  campaigns: Campaign[];
  onCreateCampaign: (stage: string) => void;
}

interface StageButton {
  x: number;
  y: number;
  width: number;
  height: number;
  stage: string;
}

export default function GrowthJourney({ campaigns, onCreateCampaign }: GrowthJourneyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [buttons, setButtons] = useState<StageButton[]>([]);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const drawCanvas = useCallback((hover: string | null = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with higher resolution for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 180 * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = '180px';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stages = ['Foundation', 'Reach', 'Engage', 'Convert', 'Delight'];
    const padding = 100;
    const width = rect.width - (padding * 2);
    const segmentWidth = width / (stages.length - 1);
    
    // Calculate points for the curve
    const points = stages.map((_, index) => ({
      x: padding + (segmentWidth * index),
      y: index === 0 ? 120 : // Start lower
         index === 1 ? 110 : // Slight initial climb
         index === 2 ? 90 :  // Steeper middle section
         index === 3 ? 60 :  // Getting near the peak
         40                  // Peak at the end
    }));

    // Draw dashed line
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;

    // Create smooth curve
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const currentPoint = points[i];
      const nextPoint = points[i + 1];
      
      const cp1x = currentPoint.x + (nextPoint.x - currentPoint.x) * 0.5;
      const cp1y = currentPoint.y;
      const cp2x = currentPoint.x + (nextPoint.x - currentPoint.x) * 0.5;
      const cp2y = nextPoint.y;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextPoint.x, nextPoint.y);
    }
    ctx.stroke();

    // Store button positions for click handling
    const newButtons: StageButton[] = [];

    // Draw stages
    stages.forEach((stage, index) => {
      const x = points[index].x;
      const y = points[index].y;
      const stageCount = campaigns.filter(c => c.stage.toLowerCase() === stage.toLowerCase()).length;

      // Draw stage card
      const cardWidth = 120;
      const cardHeight = 70;
      const cardX = x - (cardWidth / 2);
      const cardY = y - 50;

      // Store button position
      newButtons.push({
        x: cardX,
        y: cardY,
        width: cardWidth,
        height: cardHeight,
        stage
      });

      // Draw card background with hover effect
      ctx.fillStyle = stage === hover ? '#F9FAFB' : '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 8);
      ctx.fill();
      ctx.strokeStyle = stage === hover ? '#d06e63' : '#E5E7EB';
      ctx.lineWidth = stage === hover ? 2 : 1;
      ctx.setLineDash([]);
      ctx.stroke();

      // Draw stage name
      ctx.fillStyle = '#111827';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(stage, x, cardY + 25);

      // Draw campaign count
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px Inter';
      ctx.fillText(`${stageCount} campaigns`, x, cardY + 45);

      // Draw dot on the line
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = stage === hover ? '#d06e63' : '#E5E7EB';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw add campaign button with hover effect
      const buttonSize = 24;
      const buttonY = cardY + cardHeight - (buttonSize / 2);

      ctx.beginPath();
      ctx.arc(x, buttonY, buttonSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = stage === hover ? '#d06e63' : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = stage === hover ? '#FFFFFF' : '#d06e63';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw plus icon
      ctx.beginPath();
      ctx.moveTo(x - 5, buttonY);
      ctx.lineTo(x + 5, buttonY);
      ctx.moveTo(x, buttonY - 5);
      ctx.lineTo(x, buttonY + 5);
      ctx.strokeStyle = stage === hover ? '#FFFFFF' : '#d06e63';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    setButtons(newButtons);
  }, [campaigns]);

  useEffect(() => {
    drawCanvas(hoveredStage);
  }, [drawCanvas, hoveredStage]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hovered = buttons.find((button: StageButton) => {
      return (
        x >= button.x - button.width / 2 &&
        x <= button.x + button.width / 2 &&
        y >= button.y - button.height / 2 &&
        y <= button.y + button.height / 2
      );
    });

    setHoveredStage(hovered ? hovered.stage : null);
  }, [buttons]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = buttons.find((button: StageButton) => {
      return (
        x >= button.x - button.width / 2 &&
        x <= button.x + button.width / 2 &&
        y >= button.y - button.height / 2 &&
        y <= button.y + button.height / 2
      );
    });

    if (clicked) {
      onCreateCampaign(clicked.stage);
    }
  }, [buttons, onCreateCampaign]);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 mb-8 overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Growth Journey</h3>
      <div className="min-w-[800px]">
        <canvas 
          ref={canvasRef}
          className="w-full"
          style={{ height: '180px' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredStage(null)}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
