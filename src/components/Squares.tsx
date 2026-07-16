"use client";

import React, { useRef, useEffect } from "react";

interface SquaresProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}

export default function Squares({
  direction = "right",
  speed = 1,
  borderColor = "rgba(255, 255, 255, 0.05)",
  squareSize = 40,
  hoverFillColor = "rgba(99, 102, 241, 0.15)", // Indigo with opacity
  className = "",
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredSquareRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let requestRef: number;
    let gridOffset = { x: 0, y: 0 };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numSquaresX = Math.ceil(canvas.width / squareSize) + 1;
      const numSquaresY = Math.ceil(canvas.height / squareSize) + 1;

      for (let x = 0; x < numSquaresX; x++) {
        for (let y = 0; y < numSquaresY; y++) {
          const squareX = x * squareSize - (gridOffset.x % squareSize);
          const squareY = y * squareSize - (gridOffset.y % squareSize);

          if (
            hoveredSquareRef.current &&
            hoveredSquareRef.current.x === x &&
            hoveredSquareRef.current.y === y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.x = (gridOffset.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.x = (gridOffset.x + effectiveSpeed) % squareSize;
          break;
        case "up":
          gridOffset.y = (gridOffset.y + effectiveSpeed) % squareSize;
          break;
        case "down":
          gridOffset.y = (gridOffset.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.x = (gridOffset.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.y = (gridOffset.y - effectiveSpeed + squareSize) % squareSize;
          break;
      }

      drawGrid();
      requestRef = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const hoveredSquareX = Math.floor((mouseX + (gridOffset.x % squareSize)) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + (gridOffset.y % squareSize)) / squareSize);

      hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    requestRef = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestRef);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return <canvas ref={canvasRef} className={`w-full h-full border-none block ${className}`} />;
}
