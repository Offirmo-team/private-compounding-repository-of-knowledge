import * as util from 'node:util';
import { expect } from 'chai'

import { LIB } from './consts.js'

import {
	Tree,
	TreeⳇNode,
	create,
	upsertꓽnode,
	getꓽnodesⵧchildren_of,
	getꓽrepresentationⵧtxt,
} from './non-linear/tree/generic/index.js'
import { Immutable } from './_vendor/@monorepo-private/ts--types/index.js'
import { combine_normalizers, normalizeꓽtextⵧsentence } from './_vendor/@monorepo-private/normalize-string/index.js'


/////////////////////////////////////////////////


type Status =
	| 'todo'
	| 'in progress'
	| 'done'

// TODO refined todo
// nice to have

// TODO refined in-progress
//	| 'blocked'

// TODO refined done
//	| 'won’t do'


/*type ParentRelationship =
	| 'child'
	| 'option'*/

interface Payload {
	status: Status

	//parent_relationship: ParentRelationship // XXX shows that it should be a graph

	tags: string[]
}

function createꓽpayload(): Payload {
	return {
		status: 'todo',
		//parent_relationship: 'child',
		tags: [],
	}
}

type AdvancedToDo = Tree<Payload>

function createꓽtodo(): Immutable<AdvancedToDo> {
	return create({
		hooks: {
			normalizeꓽcustom_id: combine_normalizers(
				normalizeꓽtextⵧsentence,
			),
			getꓽrepresentationⵧtxtⵧ1line: (node, tree) => {
				const payload = node.payload

				const icon = (() => {
					switch (payload.status) {
						case 'todo':        return '☐'
						case 'in progress': return '🚧'
						case 'done':        return '☑'
						//case 'won’t do':    return '⛔️'
						//case 'blocked':     return '⚠'
					}
				})()

				const completion_rate = getꓽcompletion_rate(tree, node)

				return `${icon} ${(completion_rate*100).toFixed(0)}% ${node.uidⵧcustom}`
			},
		}
	})
}

function getꓽcompletion_rate(todo: Immutable<AdvancedToDo>, node: Immutable<TreeⳇNode<Payload>>): number {
	if (node.payload.status === 'done')
		return 1

	const children = getꓽnodesⵧchildren_of(todo, node)
	if (children.length === 0) {
		switch (node.payload.status) {
			case 'in progress': return 0.3
			default:            return 0
		}
	}

	const aggregated_children_rate = children.reduce((acc, child) => {
		return acc + getꓽcompletion_rate(todo, child)
	}, 0) / children.length

	let result = aggregated_children_rate
	result = Math.min(0.7, result) // can't be over 0.7 even if all children are done

	if (node.payload.status === 'in progress')
		result = Math.max(0.3, result) // can't be under 0.3 even if no child is done

	return result
}

/*
const SEP = '\n'

function parse(str: string) {
	const linesⵧraw = str.split(SEP)
	const linesⵧcleaned = linesⵧraw
		.map(line => line.trimEnd())
		.filter(line => line.length > 0)

	console.log(linesⵧcleaned)
}
*/


/////////////////////////////////////////////////

const INSPECT_OPTIONS = {
	depth: Infinity,
	colors: true,
	maxArrayLength: Infinity,
	//breakLength: getꓽterminal_size().columns,
	//compact: true,
}

function dump(...args: any[]) {
	if (args.length === 1) {
		console.log(util.inspect(args[0], INSPECT_OPTIONS))
	}
	else {
		console.log(util.inspect(args, INSPECT_OPTIONS))
	}
}
/////////////////////////////////////////////////



describe(`${LIB}`, function() {

	describe('real world use cases', function () {

		describe('Advanced TODO list', function () {

			it('should work', () => {
				let out = createꓽtodo()

				out = upsertꓽnode(out, 'be happy', { payload: createꓽpayload() })
				out = upsertꓽnode(out, 'new adventure', { parent: 'be happy'      ,payload: createꓽpayload() })
				out = upsertꓽnode(out, 'new job',       { parent: 'new adventure' ,payload: createꓽpayload() })
				out = upsertꓽnode(out, 'new place',     { parent: 'new adventure' ,payload: createꓽpayload() })

const test = `
☐ All Illustrations have dark mode!
	⇱☐ contractor work
		⇱ ☐ top missing dark illus identified
			⇱ ☐ all already done dark illus in the repo
	⇱ ☐ all front-end code use the new Illustration component
		⇱ ☐ ENGHEALTH campaign
			⇱ ☐ way to escape the campaign
			⇱ ☑ playbook up to date
			⇱ ☐ instructions page
			⇱ ☐ ENGHEALTH rule
				⇱ ☐ AFM fixed
			⇱ ☐ ENGHEALTH comms
			⇱ ☐ all known Jira illus in illustrations
			⇱ ☐ svgo passed (to prevent VR regressions)
			⇱ ☐ VR allow new defaults
				so that new VR tests are correct / updated
		⇱ ☐ AkEmptyState
		⇱ ☐ KSS

`

/*
				parse(`
new adventure
⇱ find remote / relocate / good job?
  ⇱ interview
    GAFAM
      https://foobar.withgoogle.com/
    Slack
    Cloudflare
    ⇱ apply for jobs + https://www.cnbc.com/2024/01/01/dont-forget-this-crucial-step-after-you-apply-for-a-job-says-recruiter.html
      ⇱ find target jobs / companies https://remoteok.com/
      ⇱ update CV
      ⇱ update LinkedIn
        ⇱ https://www.cnbc.com/2023/09/28/do-these-3-things-on-linkedin-and-be-head-and-shoulders-above-others.html
        ⇱ https://www.cnbc.com/2023/11/20/dont-forget-to-put-promotions-on-linkedin-says-ex-google-recruiter.html
      ⇱ update portfolio / brand
      ⇱ update skills
        ⇱ AI
        ⇱ Prompting
        ⇱ Cucumber https://school.cucumber.io/courses/take/bdd-with-cucumber-javascript/lessons/11261249-introduction-to-bdd
        ⇱ Web
        ⇱ Perf
        ⇱ C++
        ⇱ Rust
        ⇱ Python
      ⇱ Certifications? https://www.infoworld.com/article/3709508/do-programming-certifications-still-matter.html
        Jira
CSS
Google
    ⇱ train for interview
      ⇱ screening
      ⇱ system design https://www.swequiz.com/#pricing  https://designsystems.surf


https://posthog.com/handbook/people/compensation
https://github.blog/2024-01-08-github-certifications-are-generally-available/
`)

				/*
				out = graft(out, `)
*/
				dump(out)
				console.log(getꓽrepresentationⵧtxt(out))
			})

			it('should reject duplicates')
		})
	})
})
