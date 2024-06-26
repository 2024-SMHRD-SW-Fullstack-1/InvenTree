import React from "react";
import { ResponsivePie } from "@nivo/pie";

const PieChart = ({ className, totalStockCount = 0, totalReleaseCount = 0, productCount = 0 }) => {
    const centerTextLayer = {
        render: (props) => {
            const centerX = props.centerX;
            const centerY = props.centerY;

            return (
                <text
                    x={centerX}
                    y={centerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                        fontSize: "20px",
                        fontFamily: "Inter",
                        fill: "#C3CFC1",
                    }}
                >
                    현 재고 수량
                </text>
            );
        },
    };
    const leftTopTextLayer = {
        render: (props) => {
            const centerX = props.centerX - 195;
            const centerY = props.centerY - 155;

            return (
                <text
                    x={centerX}
                    y={centerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                        fontSize: "20px",
                        fontFamily: "Inter",
                        fill: "#C3CFC1",
                    }}
                >
                    입/출고 차트
                </text>
            );
        },
    };

    const valueLayer = {
        render: (props) => {
            const centerX = props.centerX;
            const centerY = props.centerY + 35;

            return (
                <text
                    x={centerX}
                    y={centerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                        fontSize: "20px",
                        fill: "#C3CFC1",
                    }}
                >
                    {productCount}
                </text>
            );
        },
    };

    return (
        <div className={className}>
            <ResponsivePie
                data={[
                    { id: "입고수량", value: totalStockCount },
                    { id: "출고수량", value: totalReleaseCount },
                ]}
                margin={{ top: 78, right: 168, bottom: 57, left: 173 }}
                innerRadius={0.77}
                padAngle={0}
                cornerRadius={0}
                colors={["#C6EE71", "#7DD8F4"]}
                borderWidth={0}
                legends={[
                    {
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 20,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 38,
                        itemDirection: "left-to-right",
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: "circle",
                    },
                ]}
                theme={{
                    text: {
                        fill: "#C3CFC1",
                        fontFamily: "Inter",
                    },
                }}
                layers={["arcs", "legends", centerTextLayer.render, valueLayer.render, leftTopTextLayer.render]}
            />
        </div>
    );
};

export default PieChart;
