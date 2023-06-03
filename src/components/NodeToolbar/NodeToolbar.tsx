import { FC, useContext } from "react";
import { NodeContext } from "components";

const NodeToolbar: FC = () => {
  const { state, dispatch } = useContext(NodeContext);
  const { selectedLayout, renderState } = state;

  const handleRenderClick = () => {
    dispatch({ type: "RENDER" });
  };

  const handleLayoutChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;

    switch (value) {
      case selectedLayout.url: {
        break;
      }
      case "CLEAR": {
        if (window.confirm("Are you sure you want to clear the board?")) {
          dispatch({ type: "CLEAR" });
        }
        break;
      }
      default: {
        if (
          window.confirm(
            "Are you sure you want to load this layout? Your progress will not be saved."
          )
        ) {
          fetch(value)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              dispatch({ type: "LOAD_LAYOUT", payload: { data, url: value } });
            })
            .catch((err) => console.error(err));
        }
      }
    }
  };

  return (
    <div className="board-controls">
      <select onChange={handleLayoutChange} value={selectedLayout.name}>
        <option value={`${selectedLayout.url}`}>{selectedLayout.name}</option>
        <option value="CLEAR">Clear</option>
        <option value={`json_layouts/hello_vertex.json`}>Hello Vertex</option>
        <option value={`json_layouts/hello_triangle.json`}>
          Hello Triangle
        </option>
      </select>
      <button onClick={handleRenderClick}>{renderState ? "Pause" : "Start Render" }</button>
    </div>
  );
};

export default NodeToolbar;
