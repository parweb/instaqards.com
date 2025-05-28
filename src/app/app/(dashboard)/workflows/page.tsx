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
            className="group block"
          >
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
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

                    <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
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
