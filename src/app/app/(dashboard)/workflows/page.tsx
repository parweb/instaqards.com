import Link from 'next/link';

import { Button } from 'components/ui/button';
import { db } from 'helpers/db';

export default async function WorkflowsPage() {
  const workflows = await db.workflow.findMany({
    include: {
      // states: { include: { user: true } },
      rules: {
        include: {
          action: true,
          trigger: true,
          executions: true,
          ruleConditions: {
            include: {
              condition: true,
              rule: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {workflows.map(workflow => (
          <Link
            href={`/workflow/${workflow.id}`}
            key={workflow.id}
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-4">
                {workflow.name}
              </h2>
              <div className="space-y-2">
                {workflow.rules.map(rule => (
                  <div key={rule.id} className="flex items-center gap-2">
                    <Button
                      size="sm"
                      type="submit"
                      className="bg-cover bg-center transition-all duration-300"
                      style={{
                        backgroundImage: `url("https://avatar.vercel.sh/${rule.trigger.code}")`,
                        textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      {rule.trigger.code}
                    </Button>

                    <div className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
                      {rule.action.description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>{workflow.rules.length} rules</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
