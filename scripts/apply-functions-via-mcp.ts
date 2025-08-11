import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

async function main() {
  const projectRef = process.env.SUPABASE_PROJECT_REF || 'zziwsyhoxfutetnrfnwu'
  const pat = process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_PAT
  if (!pat) {
    console.error('SUPABASE_ACCESS_TOKEN (PAT) is required in env to use MCP Supabase server')
    process.exit(1)
  }

  const transport = new StdioClientTransport({
    command: 'node',
    args: [
      './node_modules/@supabase/mcp-server-supabase/dist/transports/stdio.js',
      '--project-ref', projectRef,
      '--access-token', pat,
    ],
    // Narrow to Record<string, string> to satisfy type expectations
    env: Object.fromEntries(
      Object.entries(process.env).filter(([, v]) => typeof v === 'string') as [
        string,
        string
      ][]
    ),
  })

  const client = new Client({ name: 'mhcloth-funcs', version: '1.0.0' })
  await client.connect(transport)

  const sqlPath = resolve(process.cwd(), 'scripts/sql/hierarchical_categories.sql')
  const sqlAll = readFileSync(sqlPath, 'utf8')

  const matchBlocks = (name: string) => {
    const re = new RegExp(
      `CREATE OR REPLACE FUNCTION\\s+public\\.${name}[\\s\\S]*?LANGUAGE\\s+plpgsql;`,
      'g'
    )
    const m = sqlAll.match(re)
    return m ? m.join('\n\n') : ''
  }

  const functionSql = [
    matchBlocks('upsert_category'),
    matchBlocks('upsert_product'),
    matchBlocks('list_products_by_department'),
    matchBlocks('list_products_by_category'),
    // Grants (idempotent)
    `GRANT EXECUTE ON FUNCTION public.list_products_by_department(text, int, int) TO anon, authenticated;\n` +
      `GRANT EXECUTE ON FUNCTION public.list_products_by_category(text, text, int, int) TO anon, authenticated;\n` +
      `GRANT EXECUTE ON FUNCTION public.upsert_category(text, text) TO authenticated, service_role;\n` +
      `GRANT EXECUTE ON FUNCTION public.upsert_product(jsonb) TO authenticated, service_role;`,
  ]
    .filter(Boolean)
    .join('\n\n')

  const result = await client.callTool({
    name: 'apply_migration',
    arguments: {
      name: `function_fixes_${Date.now()}`,
      query: functionSql,
    },
  })

  console.log('Applied function fixes:', result)

  await client.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


