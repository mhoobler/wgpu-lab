import { Connection, Node, NodeContext } from "../../components";
import { FC, useContext, useEffect, useRef, useState } from "react";

import "./NodeBoard.less";
import { viewBoxCoords } from "data";

const NodeBoard: FC = () => {
  const { state, dispatch } = useContext(NodeContext);
  const [view, setView] = useState({
    zoom: 1.3,
    viewBox: [-200, -200, window.innerWidth * 1.3, window.innerHeight * 1.3],
  });
  const svgRef = useRef(null);

  useEffect(() => {
    const handleResize = (evt: Event) => {
      setView(({ zoom, viewBox }) => {
        const { innerWidth, innerHeight } = evt.currentTarget as Window;
        const vb = [...viewBox];
        return {
          zoom,
          viewBox: [vb[0], vb[1], innerWidth * zoom, innerHeight * zoom],
        };
      });
    };
    window.addEventListener("resize", handleResize);

    import(`json_layouts/hello_vertex.json`)
      .then((result) => {
        const data = result.default;
        dispatch({ type: "LOAD_LAYOUT", payload: { data } });
      })
      .catch((err) => console.error(err));

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRenderClick = () => {
    dispatch({ type: "RENDER" });
  };
  const handleLayoutChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;

    switch(value) {
      case(state.selectedLayout.url): {
        break;
      }
      case("CLEAR"): {
        if(window.confirm("Are you sure you want to clear the board?")) {
          dispatch({ type: "CLEAR" });
        }
        break;
      }
      default: {
        fetch(value)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            dispatch({ type: "LOAD_LAYOUT", payload: { data } });
          })
          .catch((err) => console.error(err));
      }
    }
  };

  const handleWheel = (evt: React.WheelEvent) => {
    if (evt.buttons === 0 && evt.target === svgRef.current) {
      setView(({ viewBox, zoom }) => {
        const [x, y, width, height] = [...viewBox];
        const zoomFactor = evt.deltaY > 0 ? 1.1 : 0.9;
        const zm = Math.round(zoom * zoomFactor * 100) / 100;
        const [uvx, uvy] = viewBoxCoords(evt.clientX, evt.clientY, { viewBox });

        const [newWidth, newHeight] = [
          window.innerWidth * zm,
          window.innerHeight * zm,
        ];
        const [dx, dy] = [uvx - x, uvy - y];
        const newX = x - (dx / width) * (newWidth - width);
        const newY = y - (dy / height) * (newHeight - height);

        return {
          zoom: zm,
          viewBox: [newX, newY, newWidth, newHeight],
        };
      });
    }
  };

  const handleSvgDown = (evt: React.MouseEvent) => {
    if (evt.button === 1 && svgRef.current) {
      let [mx, my] = viewBoxCoords(evt.clientX, evt.clientY, view);
      const mousemove = (evt2: MouseEvent) => {
        const [moveX, moveY] = viewBoxCoords(evt2.clientX, evt2.clientY, view);
        const vb = svgRef.current
          .getAttribute("viewBox")
          .split(" ")
          .map(parseFloat);

        vb[0] += mx - moveX;
        vb[1] += my - moveY;
        svgRef.current.setAttribute("viewBox", vb.join(" "));

        mx = moveX;
        my = moveY;
      };
      const mouseup = (evt2: MouseEvent) => {
        if (evt2.button === 1) {
          setView((state) => {
            return {
              ...state,
              viewBox: svgRef.current
                .getAttribute("viewBox")
                .split(" ")
                .map(parseFloat),
            };
          });
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);
        }
      };

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    }
  };

  return (
    <div className="node-board">
      <svg
        ref={svgRef}
        onWheel={handleWheel}
        onMouseDown={handleSvgDown}
        viewBox={`${view.viewBox.join(" ")}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {state.nodes.map((data: NodeData<unknown>) => {
          return (
            <Node
              key={data.sender.uuid}
              data={data}
              svgRef={svgRef}
              view={view}
            />
          );
        })}
        {state.connections.map((conn: NodeConnection) => {
          return (
            <Connection
              key={conn.sender.uuid + conn.receiver.uuid}
              conn={conn}
            />
          );
        })}
      </svg>
      <div className="board-controls">
        <select onChange={handleLayoutChange} value={state.selectedLayout.name}>
          <option value={`${state.selectedLayout.url}`}>{state.selectedLayout.name}</option>
          <option value="CLEAR">Clear</option>
          <option value={`json_layouts/hello_vertex.json`}>Hello Vertex</option>
          <option value={`json_layouts/hello_triangle.json`}>
            Hello Triangle
          </option>
        </select>
        <button onClick={handleRenderClick}>Render</button>
      </div>
    </div>
  );
};

export default NodeBoard;
