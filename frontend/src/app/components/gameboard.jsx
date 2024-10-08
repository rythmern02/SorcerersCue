"use client"
// src/components/PoolTable.js

import React, { useRef, useEffect } from 'react';

const PoolTable = ({ balls, cuePosition, takeShot }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        drawTable(context);
        drawBalls(context, balls);
        drawCue(context, cuePosition);
    }, [balls, cuePosition]);

    const drawTable = (context) => {
        context.fillStyle = '#2e8b57'; // Green table background
        context.fillRect(0, 0, 800, 400); // Example size
    };

    const drawBalls = (context, balls) => {
        balls?.forEach(ball => {
            context.beginPath();
            context.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true); // 10 is the radius
            context.fillStyle = ball.color;
            context.fill();
        });
    };

    const drawCue = (context, cuePosition) => {
        context.beginPath();
        context.moveTo(cuePosition?.startX, cuePosition?.startY);
        context.lineTo(cuePosition?.endX, cuePosition?.endY);
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        context.stroke();
    };

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onClick={(e) => {
                const shot = calculateShot(e);
                takeShot(shot);
            }}
        />
    );
};

export default PoolTable;
