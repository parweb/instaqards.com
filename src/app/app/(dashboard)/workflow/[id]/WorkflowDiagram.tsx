'use client';

import ReactFlow, {
  Background,
  Controls,
  Edge,
  Handle,
  Node,
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback } from 'react';

interface WorkflowDiagramProps {
  workflow: any;
}

const TriggerNode = ({ data }: { data: any }) => (
  <div className="rounded-lg border border-gray-200 bg-blue-50 p-4 shadow-sm dark:border-gray-700 dark:bg-blue-900">
    <Handle type="source" position={Position.Right} />
    <div className="text-sm font-medium">Trigger: {data.code}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
  </div>
);

const ActionNode = ({ data }: { data: any }) => (
  <div className="rounded-lg border border-gray-200 bg-green-50 p-4 shadow-sm dark:border-gray-700 dark:bg-green-900">
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <div className="text-sm font-medium">{data.internalName}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
    <div className="mt-2 text-xs">
      <span className="rounded bg-green-200 px-2 py-1 dark:bg-green-800">
        {data.actionType}
      </span>
    </div>
  </div>
);

const ConditionNode = ({ data }: { data: any }) => (
  <div className="rounded-lg border border-gray-200 bg-yellow-50 p-4 shadow-sm dark:border-gray-700 dark:bg-yellow-900">
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <div className="text-sm font-medium">{data.name}</div>
    <div className="text-xs text-gray-500">{data.type}</div>
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode
};

export const WorkflowDiagram = ({ workflow }: WorkflowDiagramProps) => {
  const createNodes = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    workflow.rules.forEach((rule: any, index: number) => {
      // Add trigger node
      const triggerId = `trigger-${rule.id}`;
      nodes.push({
        id: triggerId,
        type: 'trigger',
        position: { x: 0, y: yOffset },
        data: rule.trigger
      });

      // Add condition nodes if they exist
      let lastNodeId = triggerId;
      if (rule.ruleConditions.length > 0) {
        rule.ruleConditions.forEach((condition: any, condIndex: number) => {
          const conditionId = `condition-${rule.id}-${condIndex}`;
          nodes.push({
            id: conditionId,
            type: 'condition',
            position: { x: 300, y: yOffset + condIndex * 100 },
            data: condition.condition
          });

          edges.push({
            id: `edge-${lastNodeId}-${conditionId}`,
            source: lastNodeId,
            target: conditionId,
            animated: true
          });

          lastNodeId = conditionId;
        });
      }

      // Add action node
      const actionId = `action-${rule.id}`;
      nodes.push({
        id: actionId,
        type: 'action',
        position: { x: 600, y: yOffset },
        data: rule.action
      });

      edges.push({
        id: `edge-${lastNodeId}-${actionId}`,
        source: lastNodeId,
        target: actionId,
        animated: true
      });

      yOffset += 200;
    });

    return { nodes, edges };
  }, [workflow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes().nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(createNodes().edges);

  return (
    <div className="h-[800px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
