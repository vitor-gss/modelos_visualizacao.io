import { Treemap, type TreemapNode } from "recharts";
import data2 from "../../mock/data2";

export const ModeloTreemap = () => {
  const CustomContent = (props: TreemapNode) => {
    const { x, y, width, height, name } = props;

    if (width < 40 || height < 20) return <g />;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: "rgba(165, 54, 235)",
            stroke: "#fff",
            strokeWidth: 1,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={14}
          // fontWeight="bold"
        >
          {name}
        </text>
      </g>
    );
  };

  return (
    <Treemap
      style={{ width: "100%", aspectRatio: 4 / 3 }}
      data={data2}
      dataKey="size"
      aspectRatio={4 / 3}
      stroke="#fff"
      content={CustomContent}
    ></Treemap>
  );
};
