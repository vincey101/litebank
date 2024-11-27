class TikzChart {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setCanvasSize();
    }

    setCanvasSize() {
        // Make canvas crisp on high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
    }

    drawGrid() {
        const gridSize = 20;
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawTitle(title) {
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.canvas.width / 2, 25);
    }

    drawBalanceChart(data) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawTitle('Balance Trend');

        const padding = 40;
        const width = this.canvas.width - 2 * padding;
        const height = this.canvas.height - 2 * padding;

        // Draw axes labels
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';

        // Y-axis labels
        const maxValue = Math.max(...data.map(p => p.value));
        for (let i = 0; i <= 5; i++) {
            const y = height + padding - (i * height / 5);
            const value = (i * maxValue / 5).toFixed(0);
            this.ctx.fillText(`$${value}`, padding - 5, y + 4);
        }

        // X-axis labels
        this.ctx.textAlign = 'center';
        data.forEach((point, index) => {
            const x = padding + (index * width) / (data.length - 1);
            this.ctx.fillText(point.date, x, height + padding + 20);
        });

        // Draw axes (TikZ style)
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height + padding);
        this.ctx.lineTo(width + padding, height + padding);
        this.ctx.stroke();

        // Draw balance line
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#2563eb';
        this.ctx.lineWidth = 3;
        data.forEach((point, index) => {
            const x = padding + (index * width) / (data.length - 1);
            const y = height + padding - (point.value * height) / Math.max(...data.map(p => p.value));

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            // Draw point nodes (TikZ style)
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
        this.ctx.stroke();
    }

    drawTransactionPie(transactions) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTitle('Transaction Distribution');

        const centerX = this.canvas.width / 2;
        const centerY = (this.canvas.height / 2) + 10;
        const radius = Math.min(centerX, centerY) - 60;
        let startAngle = 0;

        // Draw legend
        const legendY = this.canvas.height - 30;
        const legendSpacing = this.canvas.width / transactions.length;
        transactions.forEach((transaction, index) => {
            const legendX = (legendSpacing * index) + (legendSpacing / 2);

            // Legend color box
            this.ctx.fillStyle = transaction.color;
            this.ctx.fillRect(legendX - 30, legendY, 15, 15);

            // Legend text
            this.ctx.fillStyle = '#1e293b';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(transaction.label, legendX - 10, legendY + 12);
        });

        // Draw TikZ-style pie segments
        transactions.forEach(transaction => {
            const sliceAngle = (transaction.percentage / 100) * Math.PI * 2;

            // Segment
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = transaction.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Label
            const labelAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

            this.ctx.fillStyle = '#1e293b';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${transaction.percentage}%`, labelX, labelY);

            startAngle += sliceAngle;
        });
    }

    drawRiskMatrix(risks) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTitle('Risk Assessment Matrix');

        const padding = 40;
        const cellSize = Math.min(
            (this.canvas.width - 2 * padding) / 3,
            (this.canvas.height - 2 * padding - 40) / 3
        );

        // Add axis labels
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';

        // Y-axis label
        this.ctx.save();
        this.ctx.translate(15, this.canvas.height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Risk Level', 0, 0);
        this.ctx.restore();

        // X-axis label
        this.ctx.fillText('Value Impact', this.canvas.width / 2, this.canvas.height - 10);

        risks.forEach((risk, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = padding + col * cellSize;
            const y = padding + row * cellSize;

            // TikZ-style cell
            this.ctx.fillStyle = risk.color;
            this.ctx.fillRect(x, y, cellSize, cellSize);
            this.ctx.strokeStyle = '#1e293b';
            this.ctx.strokeRect(x, y, cellSize, cellSize);

            // Label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(risk.label, x + cellSize / 2, y + cellSize / 2);
        });
    }
} 