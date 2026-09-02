import * as RichText from '@monorepo-private/rich-text-format'
import { renderⵧto_text } from "@monorepo-private/rich-text-format--to-textual"

let count = 0

/////////////////////////////////////////////////
// single node

{
	count++
	let $doc: RichText.NodeLike = 'Hello, world!'
	demo($doc)
}

{
	count++
	let $doc: RichText.NodeLike = {
		$content: 'Hello, world!',
	}
	demo($doc)
}

/////////////////////////////////////////////////

{
	count++
	let $doc: RichText.NodeLike = {
		$content: 'Hello, ⎨⎨target⎬⎬!',
		$refs: {
			target: {
				$type: 'strong',
				$content: 'world',
			},
		},
	}
	demo($doc)
}

/////////////////////////////////////////////////
// sub-node is provided by the parent
{
	count++

	let $doc: RichText.NodeLike = {
		$content: '⎨⎨greetings⎬⎬',
		$refs: {
			target: {
				$type: 'strong',
				$content: 'world',
			},
			greetings: 'Hello, ⎨⎨target⎬⎬!', // yes, we allow refs in primitive strings
		},
	}
	demo($doc)
}

/////////////////////////////////////////////////
// lists

{
	count++
	const $doc = {
		$type: 'ol',
		$heading: '3 sector model',
		$content: ['primary = raw materials', 'secondary = manufacturing', 'tertiary = services'],
	}
	demo($doc)
}

/////////////////////////////////////////////////
// structured content

{
	count++
	// https://fr.wikisource.org/wiki/Charte_internationale_des_Droits_de_l%E2%80%99Homme_(1948)/D%C3%A9claration_universelle_des_Droits_de_l%E2%80%99Homme
	const $doc = {
		$heading: 'Déclaration universelle des Droits de l’Homme',
		$content: [
			{
				$heading: 'Préambule',
				$content: [
					'Considérant que la reconnaissance de la dignité inhérente à tous les membres de la famille humaine et de leurs droits égaux et inaliénables constitue le fondement de la liberté, de la justice et de la paix dans le monde',
					'...',
					'L’Assemblée Générale⎨⎨br⎬⎬Proclame la présente Déclaration Universelle des Droits de l’Homme comme l’idéal commun à atteindre par tous les peuples et toutes les nations...',
				],
			},
			{
				$heading: 'Article premier',
				$content: [
					'Tous les êtres humains naissent libres et égaux en dignité et en droits. Ils sont doués de raison et de conscience et doivent agir les uns envers les autres dans un esprit de fraternité.',
				],
			},
			{
				$heading: 'Article 2',
				$content: [
					'Chacun peut se prévaloir de tous les droits et de toutes les libertés proclamés dans la présente Déclaration, sans distinction aucune...',
				],
			},
		],
	}
	demo($doc)
}

/////////////////////////////////////////////////
// tables
// TODO 1D

/////////////////////////////////////////////////
/*
import * as DEMOS from '@monorepo-private/rich-text-format/demos'

function demo(wrapped_doc) {
	const key = Object.keys(wrapped_doc)[0]
	const doc = wrapped_doc[key]

	console.log(`\n------- ${key} -------`)

	console.log('\n------- to text -------\n' + RichText.renderⵧto_text(doc, {
		//style: 'advanced', // default
		style: 'markdown',
	}))

	if (renderⵧto_terminal)
}

Object.entries(DEMOS).forEach((entry) => {
	demo(Object.fromEntries([entry]))
})

// TODO actions
// TODO links
*/

/////////////////////////////////////////////////

function demo($doc: Immutable<RichText.NodeLike>) {
	console.log(
		`------- #${count} to text -------\n`
			+ renderⵧto_text($doc),
	)
}
