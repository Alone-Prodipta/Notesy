import React, { useCallback } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Cards from "../card";


function CardNodeWrapper({ data }) {
    return (
        <div className="relative inline-block">
            
            <style>
                {`
               
                .card-node-content > div:not(:first-child) {
                    display: none !important;
                }
               
                .card-node-content > div:first-child {
                    float: none !important;
                    transform: none !important;
                }
            `}
                
            </style>

            
            <Handle
                type="target"
                position={Position.Left}
                className="w-4! h-4! bg-blue-600! border-2! border-white! z-50 cursor-crosshair top-1/2! -translate-y-1/2! -left-2!"
            />

           
            <div className="card-node-content">
                <Cards color={data?.color} quantity={data?.quantity} />
            </div>

            
            <Handle
                type="source"
                position={Position.Right}
                className="w-4! h-4! bg-blue-600! border-2! border-white! z-50 cursor-crosshair top-1/2! -translate-y-1/2! -right-2!"
            />
        </div>
    );
}


const nodeTypes = {
    cardNode: CardNodeWrapper,
};


const initialNodes = Array.from({ length: 10 }, (_, index) => ({
    id: `card-node-${index + 1}`,
    type: "cardNode",
    position: { x: 100 + (index % 5) * 300, y: 100 + Math.floor(index / 5) * 440 },
    data: {},
}));

const initialEdges = [];

function Foreground() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    
    const onConnect = useCallback(
        (connection) =>
            setEdges((eds) =>
                addEdge(
                    { ...connection, animated: false, style: { stroke: "white", strokeWidth: 3 } },
                    eds
                )
            ),
        [setEdges]
    );

    return (
        <div className="fixed z-3 top-0 left-0 w-screen h-screen bg-zinc-800">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView>
                <Background color="white" gap={20} />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default Foreground;