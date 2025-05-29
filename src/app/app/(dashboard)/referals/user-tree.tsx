'use client';

import type { Prisma } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import dagre from 'dagre';
import { cn } from 'lib/utils';
import type { MouseEvent } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LuChevronDown, LuChevronRight, LuLayoutGrid } from 'react-icons/lu';

import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeChange
} from 'reactflow';

import 'reactflow/dist/style.css';

type UserWithRecursiveAffiliates = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
  };
}> & {
  affiliates: UserWithRecursiveAffiliates[];
};

type UserTreeProps = {
  rootUsers: UserWithRecursiveAffiliates[];
};

type NodeData = UserWithRecursiveAffiliates & {
  isExpanded?: boolean;
};

const UserNode = memo(
  ({
    data: { id, affiliates, name, email, isExpanded = false, image }
  }: {
    data: NodeData;
  }) => {
    const affiliatesCount = affiliates.length;

    const avatar = image ?? `https://avatar.vercel.sh/${email}`;

    return (
      <div className="min-w-[250px] rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        {id !== 'root' && (
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-gray-400"
          />
        )}

        <div className="flex items-center gap-3">
          <div className="drag-handle flex h-10 w-10 cursor-move items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatar} alt={name ?? ''} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium select-none">
              {name || 'Anonymous'}
            </span>

            <span className="text-xs text-gray-500 select-none dark:text-gray-400">
              {email}
            </span>
          </div>

          {affiliatesCount > 0 && (
            <button
              className="flex items-center gap-1 text-xs text-gray-500 select-none hover:text-gray-700 dark:hover:text-gray-300"
              data-collapse-trigger
            >
              {isExpanded ? (
                <LuChevronDown className="h-4 w-4" />
              ) : (
                <LuChevronRight className="h-4 w-4" />
              )}

              <span>
                {affiliatesCount} affilié{affiliatesCount > 1 ? 's' : ''}
              </span>
            </button>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className={cn('invisible !bg-gray-400', { visible: isExpanded })}
        />
      </div>
    );
  }
);

UserNode.displayName = 'UserNode';

const nodeTypes = {
  userNode: UserNode
};

const INITIAL_VIEWPORT = { x: 0, y: 0, zoom: 0.8 };

const ErrorFallback = () => (
  <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
    An error occurred while rendering the tree
  </div>
);

const createLayoutedElements = (rootUsers: UserWithRecursiveAffiliates[]) => {
  const spacing = 300;
  const verticalSpacing = 150;
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const layoutNode = (
    user: UserWithRecursiveAffiliates,
    parentX: number,
    level: number,
    parentId?: string
  ) => {
    const childCount = user.affiliates.length;
    const x = parentX;
    const y = level * verticalSpacing;

    nodes.push({
      id: user.id,
      type: 'userNode',
      position: { x, y },
      data: user,
      dragHandle: '.drag-handle'
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${user.id}`,
        source: parentId,
        target: user.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#94a3b8' }
      });
    }

    const startX = x - (spacing * (childCount - 1)) / 2;
    user.affiliates.forEach((affiliate, index) => {
      const childX = startX + index * spacing;
      layoutNode(affiliate, childX, level + 1, user.id);
    });
  };

  const rootSpacing = spacing * 2;
  const startX = -(rootSpacing * (rootUsers.length - 1)) / 2;
  rootUsers.forEach((user, index) => {
    const rootX = startX + index * rootSpacing;
    layoutNode(user, rootX, 0);
  });

  return { nodes, edges };
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'TB'
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 250;
  const nodeHeight = 100;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 100,
    marginx: 50,
    marginy: 50
  });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };
  });
};

const Flow = memo(({ rootUsers }: UserTreeProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const { fitView } = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const { nodes: initialNodes, edges } = useMemo(() => {
    const processUser = (user: UserWithRecursiveAffiliates): NodeData => ({
      ...user,
      isExpanded: user.id === 'root'
    });
    const processedRootUsers = rootUsers.map(processUser);
    return createLayoutedElements(processedRootUsers);
  }, [rootUsers]);

  useEffect(() => {
    if (isInitialMount.current) {
      setNodes(initialNodes);
      isInitialMount.current = false;
    }
  }, [initialNodes]);

  const visibleNodes = useMemo(() => {
    const visibleNodeIds = new Set<string>();

    const collectVisibleNodes = (nodeId: string, isParentExpanded: boolean) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      if (isParentExpanded) {
        visibleNodeIds.add(nodeId);

        if (node.data.isExpanded) {
          edges
            .filter(edge => edge.source === nodeId)
            .forEach(edge => collectVisibleNodes(edge.target, true));
        }
      } else if (nodeId === 'root') {
        visibleNodeIds.add(nodeId);
      }
    };

    collectVisibleNodes('root', true);
    return nodes.filter(node => visibleNodeIds.has(node.id));
  }, [nodes, edges]);

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    return edges.filter(
      edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [edges, visibleNodes]);

  const layoutedPositions = useMemo(() => {
    const layouted = getLayoutedElements(visibleNodes, visibleEdges);
    return new Map(layouted.map(node => [node.id, node.position]));
  }, [visibleNodes, visibleEdges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => applyNodeChanges(changes, nds));
  }, []);

  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(visibleNodes, visibleEdges);
    setNodes(currentNodes =>
      currentNodes.map(node => {
        const layoutNode = layouted.find(n => n.id === node.id);
        return layoutNode || node;
      })
    );
    setTimeout(() => {
      fitView({ duration: 800, padding: 0.5 });
    }, 50);
  }, [visibleNodes, visibleEdges, fitView]);

  const onNodeClick = useCallback(
    (evt: MouseEvent, node: Node) => {
      const target = evt.target as HTMLElement;

      if (target.closest('[data-collapse-trigger]')) {
        setNodes(currentNodes =>
          currentNodes.map(n => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  isExpanded: !n.data.isExpanded
                }
              };
            }
            return n;
          })
        );
        return;
      }

      fitView({ duration: 800, padding: 0.5 });
    },
    [fitView]
  );

  const nodesWithLayout = useMemo(() => {
    return visibleNodes.map(node => ({
      ...node,
      position: layoutedPositions.get(node.id) || node.position
    }));
  }, [visibleNodes, layoutedPositions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ duration: 800, padding: 0.5 });
    }, 50);
    return () => clearTimeout(timer);
  }, [fitView, nodesWithLayout]);

  return (
    <div
      ref={flowRef}
      className="h-[800px] w-full rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <ReactFlow
        nodes={nodesWithLayout}
        edges={visibleEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={INITIAL_VIEWPORT}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        fitViewOptions={{ padding: 0.5, includeHiddenNodes: false }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#94a3b8"
          className="opacity-50"
        />

        <Controls showInteractive={false}>
          <button
            onClick={onLayout}
            className="react-flow__controls-button"
            title="Auto Layout"
          >
            <LuLayoutGrid />
          </button>
        </Controls>

        <MiniMap
          nodeColor="#94a3b8"
          maskColor="#ffffff50"
          className="rounded-lg border border-gray-200 dark:border-gray-700"
        />
      </ReactFlow>
    </div>
  );
});

Flow.displayName = 'Flow';

export const UserTree = memo(({ rootUsers }: UserTreeProps) => {
  if (rootUsers.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No users found
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Flow rootUsers={rootUsers} />
      </ErrorBoundary>
    </ReactFlowProvider>
  );
});

UserTree.displayName = 'UserTree';
