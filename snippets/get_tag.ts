const https = require('https')

// args: token=, group=, topic=, after=, pretty=true

type CustomArgs = {
  token?: string
  group?: string
  topic?: string
  after?: string
  pretty?: true
}

const args: CustomArgs = process.argv
  .slice(2)
  .map(arg => arg.split('='))
  .reduce((args, [value, key]) => {
    args[value] = key
    return args
  }, {})

const project_path = (): string =>
  `/api/v4/groups/${
    args.group ? args.group : 13
  }/projects?pagination=keyset&per_page=100&order_by=id&sort=asc&archived=false`

const release_path = id => `/api/v4/projects/${id}/repository/tags`

function options(path: string) {
  return {
    hostname: 'scm.idlogiq.com',
    path: path,
    headers: {
      'PRIVATE-TOKEN': `${args.token}`
    }
  }
}

type RequestOption = ReturnType<typeof options>

const makeRequest = async (
  options: RequestOption,
  project: boolean = true
): Promise<Array<unknown>> => {
  return new Promise((resolve, reject) => {
    const req = https.get(options, response => {
      let data: string | Array<any> = ''
      response.on('data', chunk => {
        data += chunk as string
      })
      response.on('end', () => {
        data = JSON.parse(data as string)
        if (project && args.topic) {
          if (typeof data === 'string') return
          data = data.filter(d =>
            d.tag_list
              .map(t => t.toLowerCase())
              .includes(args.topic!.toLowerCase())
          )
          if (args.after) {
            let after = new Date()
            if (args.after == 'today') {
              after.setHours(0)
              after.setMinutes(0)
              after.setMilliseconds(0)
            } else {
              after = new Date(args.after)
            }
            data = data.filter(d => {
              const date = new Date(d.last_activity_at)
              return date >= after
            })
          }
        }
        resolve(data as Array<unknown>)
      })
    })
    req.on('error', err => {
      reject(err)
    })
    req.end()
  })
}

type Project = {
  id: number
  path: string
}

type Release = {
  name: string
  release: {
    description: string
  }
  project: number
}

const run = async () => {
  console.info('checking infomation...\n')
  const res = ((await makeRequest(options(project_path()), true)) ||
    []) as Array<Project>
  let results = await Promise.all(
    res.map(async project => {
      const releases = (await makeRequest(
        options(release_path(project.id)),
        false
      )) as Array<Release>
      if (releases.length == 0) return null
      return {
        project: project.path,
        tag: releases[0].name,
        description:
          releases[0] && releases[0].release && releases[0].release.description
      }
    })
  )

  const removeNull = <TValue>(item: TValue | null): item is TValue => {
    return item !== null
  }
  results = results.filter(removeNull)
  results = results.sort((a, b) => {
    if (a!.project < b!.project) return -1
    if (a!.project > b!.project) return 1
    return 0
  })

  type ConsoleResult = typeof results | string
  const consoleResut: ConsoleResult = args.pretty
    ? results.map(r => `| ${r!.project} | ${r!.tag} |`).join('\n')
    : results

  if (args.pretty) {
    console.info(results)
  } else {
    if (typeof consoleResut === 'string') return
    consoleResut.forEach((r, index) => {
      console.info(`index: ${index}`)
      console.info(`name: ${r!.project}`)
      console.info(`tag: ${r!.tag}`)
      console.info(`description: \n${r!.description}`)
    })
  }
}

run()
// example: node get_deploy_tag.js token=${ACCESS_TOKEN} group=13 pretty=true
