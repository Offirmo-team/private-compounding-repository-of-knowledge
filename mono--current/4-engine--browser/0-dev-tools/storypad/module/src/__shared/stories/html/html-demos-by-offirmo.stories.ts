const LIB = "Offirmo’s HTML demos"

////////////////////////////////////////////////////////////////////////////////////

export function Intro() {
	return `
		<main>
			<h1>${LIB}</h1>
			<h2>Intro</h2>

			<p>
				What I’m saying is that it’s so, so simple to make sites easier to read. Websites are broken by default,
				they are
				functional, high-performing, and accessible, but they’re also fucking ugly. You and all the other web
				designers out
				there need to make them not total shit.
			</p>

			<p>
				<strong>emphasized text</strong>
				Normal text
				<span class="o⋄colorꘌsecondary">secondary text</span>
				<span class="o⋄colorꘌancillary">ancillary text</span>
				<a href=".">link</a>
			</p>

			<p>Strongly inspired by:</p>
			<ol>
				<li><a href="https://motherfuckingwebsite.com/">motherfuckingwebsite.com</a>,</li>
				<li><a href="https://bettermotherfuckingwebsite.com/">bettermotherfuckingwebsite.com</a>,</li>
				<li><a href="https://perfectmotherfuckingwebsite.com/">perfectmotherfuckingwebsite.com</a></li>
				<li>and <a href="https://docs.google.com/spreadsheets/d/1wc7Arr5YyOjFmSvJfmQnPfxgPQXXaRSPu21tfAhIuAQ/">many blogs posts</a>…</li>
			</ol>
		</main>
	`
}

////////////////////////////////////////////////////////////////////////////////////

export function DemoꓽBase() {
	return `
		<div>
			<h1>The five boxing wizards jump quickly</h1>
			<h2>Sphinx of black quartz, judge my vow!</h2>
			<h3>Pack my box with five dozen liquor jugs!</h3>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at varius eros. Curabitur pulvinar metus diam, nec aliquet felis pellentesque et. Ut iaculis aliquam augue, sed vestibulum lacus varius at. Mauris et facilisis massa. Sed vehicula placerat convallis. Sed dui magna, semper non neque non, semper dapibus lacus.
			</p>
			<ul>
				<li>Foo</li>
				<li>Bar</li>
			</ul>
			<ol>
				<li>Foo</li>
				<li>Bar</li>
			</ol>

			<details>
				<summary>Details: expand me...</summary>
				<p>Hello, world!</p>
			</details>

			<dl><dt>Term</dt><dd>Definition.</dd></dl>

			<figure>
				<img alt="a cute kitty" src='https://placekitten.com/200/300'/>
				<figcaption>A figure caption!</figcaption>
			</figure>

			<q>Quoted text</q> <cite>— Author Name</cite>
		</div>
	`
}

////////////////////////////////////////////////////////////////////////////////////

export function DemoꓽControls() {
	return `
			<form action="">
				<table summary="dev">

					<tr>
						<td>
							input type = button
						</td>
						<td>
							<div class="o⋄input-container">
								click here
								<input type="button" name="button" value="Button" />
							</div>
						</td>
					</tr>

					<tr>
						<td>
							input type = checkbox
						</td>
						<td>
							<div class="o⋄input-container">
								<input type="checkbox" name="checkbox" /> deselected
							</div>
							<div class="o⋄input-container">
								<input type="checkbox" name="checkbox" checked={true}/> selected
							</div>
						</td>
					</tr>

					<tr>
						<td>
							input type = color
						</td>
						<td>
							<input type="color" name="color" />
						</td>
					</tr>

					<tr>
						<td>
							input type = date
						</td>
						<td>
							<input type="date" name="date" data-form-type="date" />
						</td>
					</tr>

					<tr>
						<td>
							input type = email
						</td>
						<td>
							<div class="o⋄input-container">
								<label>Enter your email</label>
								<input type="email" name="email" data-form-type="email" />
							</div>
						</td>
					</tr>

					<tr>
						<td>
							input type = file
						</td>
						<td>
							<div class="o⋄input-container">
								<label>Select a file</label>
								<input type="file" accept="image/*, text/*" name="file" />
							</div>
						</td>
					</tr>

					<tr>
						<td>
							input type = number
						</td>
						<td>
							<input type="number" name="number" data-form-type="other" />
						</td>
					</tr>

					<tr>
						<td>
							input type = password
						</td>
						<td>
							<input type="password" name="password" data-form-type="password" value="xxx"/>
						</td>
					</tr>

					<tr>
						<td>
							input type = radio
						</td>
						<td>
							<input type="radio" name="radio" />
						</td>
					</tr>

					<tr>
						<td>
							input type = range
						</td>
						<td>
							<input type="range" name="range" min="0" max="25" />
						</td>
					</tr>

					<tr>
						<td>
							input type = tel
						</td>
						<td>
							<input type="tel" name="tel" data-form-type="phone" />
						</td>
					</tr>

					<tr>
						<td>
							input type = text
						</td>
						<td>
							<input type="text" name="text" data-form-type="other" />
						</td>
					</tr>

					<tr>
						<td>
							input type = time
						</td>
						<td>
							<input type="time" name="time" data-form-type="other" />
						</td>
					</tr>

					<tr>
						<td>
							input type = url
						</td>
						<td>
							<input type="url" name="url" data-form-type="other" />
						</td>
					</tr>
				</table>


				<fieldset>
					<legend>Fieldset checkbox</legend>

					<div class="o⋄input-container">
						<input type="checkbox" id="berries_1" value="strawberries" name="berries" />
						<label htmlFor="berries_1">Strawberries</label>
					</div>
					<div class="o⋄input-container">
						<input type="checkbox" id="berries_2" value="blueberries" name="berries" checked={true}/>
						<label htmlFor="berries_2">Blueberries</label>
					</div>
					<div class="o⋄input-container">
						<input type="checkbox" id="berries_3" value="bananas" name="berries" />
						<label htmlFor="berries_3">Bananas (yes, they are berries)</label>
					</div>
					<div class="o⋄input-container">
						<input type="checkbox" id="berries_4" value="blackberries" name="berries" checked={true}/>
						<label htmlFor="berries_4">Blackberries</label>
					</div>
					<div class="o⋄input-container">
						<input type="checkbox" id="berries_5" value="loganberries" name="berries" />
						<label htmlFor="berries_5">Loganberries</label>
					</div>
				</fieldset>

				<fieldset>
					<legend>Fieldset radio</legend>

					<div class="o⋄input-container">
						<input type="radio" id="kraken" name="monster" />
						<label htmlFor="kraken">Kraken</label><br/>
					</div>

					<div class="o⋄input-container">
						<input type="radio" id="sasquatch" name="monster" checked={true}/>
						<label htmlFor="sasquatch">Sasquatch</label><br/>
					</div>

					<div class="o⋄input-container">
						<input type="radio" id="mothman" name="monster" />
						<label htmlFor="mothman">Mothman</label>
					</div>

				</fieldset>

				<textarea rows="3"></textarea>

				<select>
					Select
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
					<option>5</option>
				</select>

				<button type="submit">Submit</button>
			</form>
			`
}

////////////////////////////////////////////////////////////////////////////////////

export function DemoꓽTrees() {
	return `
<div class="o⋄children-spacing⁚flow">
	<h1>The five boxing wizards jump quickly</h1>
	<h2>Sphinx of black quartz, judge my vow!</h2>
	<h3>Pack my box with five dozen liquor jugs!</h3>

	<ul>
		<li>Foo</li>
		<li>Bar</li>
		<li>Deeper:
			<ul>
				<li>Deep Foo</li>
				<li>Deep Bar</li>
				<li>Deeper:
					<ul>
						<li>Deep Deep Foo</li>
						<li>Deep Deep Bar</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>

	<ol>
		<li>Foo</li>
		<li>Bar</li>
		<li>Deeper:
			<ol>
				<li>Deep Foo</li>
				<li>Deep Bar</li>
				<li>Deeper:
					<ol>
						<li>Deep Deep Foo</li>
						<li>Deep Deep Bar</li>
					</ol>
				</li>
			</ol>
		</li>
	</ol>

	<ul class="o⋄children-spacing⁚flow">
		<li class="o⋄children-spacing⁚flow">Foo</li>
		<li class="o⋄children-spacing⁚flow">Bar</li>
		<li class="o⋄children-spacing⁚flow">Deeper:
			<ul class="o⋄children-spacing⁚flow">
				<li class="o⋄children-spacing⁚flow">Deep Foo</li>
				<li class="o⋄children-spacing⁚flow">Deep Bar</li>
				<li class="o⋄children-spacing⁚flow">Deeper:
					<ul class="o⋄children-spacing⁚flow">
						<li>Deep Deep Foo</li>
						<li>Deep Deep Bar</li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>

	<details>
		<summary>Details: expand me...</summary>
		<p>Hello, world!
			<details>
				<summary>Details: expand me...</summary>
				<p>Hello, world!</p>
			</details>
		</p>
	</details>

	<p>p#1</p>
	<p>p#2</p>
	<hr />
	<p>p#3</p>

	<div>
		(div with no flow)
		<p>p#1 in a div</p>
		<p>p#2 in a div</p>
		<hr />
		<p>p#3 in a div</p>
	</div>

	<hr />

</div>
		`
}

////////////////////////////////////////////////////////////////////////////////////

export function DemoꓽSemantic() {
	return `
<div class="o⋄children-spacing⁚flow">
	<header>
		<nav>
			<ul class="o⋄nav-list">
				<li class="o⋄text-noselect o⋄colorꘌsecondary"><a href=".">Home</a></li>
				<li class="o⋄text-noselect o⋄colorꘌsecondary"><a href=".">Nav1</a></li>
				<li class="o⋄text-noselect o⋄colorꘌsecondary"><a href=".">Nav2</a></li>
			</ul>
		</nav>
	</header>

	<hr class="o⋄border-colorꘌancillary"/>

	<main class="o⋄children-spacing⁚flow">
		<article class="o⋄children-spacing⁚flow">
			<h1>The five boxing wizards jump quickly</h1>
			Posted <time dateTime="2017-01-01">1y ago</time>.
			<figure>
				<img alt="a cute kitty" src='https://placekitten.com/200/300'/>
				<figcaption>A figure caption!</figcaption>
			</figure>
			<h2>Sphinx of black quartz, judge my vow!</h2>
			<h3>Pack my box with five dozen liquor jugs!</h3>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id augue ante. Aliquam tristique viverra tellus sed ullamcorper. Vivamus velit ipsum, tempus et sapien sit amet, luctus ultricies est. Phasellus ac ipsum vulputate, volutpat libero non, dictum ligula. Cras tincidunt justo urna, nec consequat lectus luctus vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec lacinia sed nisi nec viverra.
			</p>
			<p>
				Maecenas in laoreet est. Morbi blandit enim magna, a semper orci facilisis quis. In vehicula sagittis turpis vel eleifend. Nullam aliquet feugiat cursus. Mauris orci purus, pellentesque vitae interdum eu, blandit sed ligula. Cras eu mattis quam, vel ornare ante. Duis molestie eros dui, at varius odio viverra in. In rhoncus, ante eget fermentum eleifend, massa eros tincidunt purus, quis maximus sapien odio ut enim. Suspendisse ex purus, aliquet sed velit porta, tempus sodales lorem.
			</p>
			<h3>Pack my box with five dozen liquor jugs!</h3>
			<p>
				Pellentesque gravida tincidunt risus sit amet varius. Cras ac luctus mauris. Aliquam erat volutpat. In hac habitasse platea dictumst. Aliquam metus sapien, suscipit vel dapibus a, convallis nec lorem. Suspendisse ac rhoncus urna, nec ornare metus. Sed at porttitor nisl. Curabitur vestibulum tempus mattis.
			</p>
			<ul>
				<li>Foo</li>
				<li>Bar</li>
			</ul>
			<p>
				Nullam euismod massa neque, vitae sollicitudin diam tincidunt non. Phasellus interdum felis congue, semper libero et, efficitur mauris. Aenean velit leo, egestas dignissim enim ut, tincidunt facilisis velit. Aliquam orci augue, facilisis nec mauris quis, finibus sagittis quam. Morbi orci libero, consequat in placerat sit amet, dignissim at elit. Curabitur lobortis neque vel aliquet ultrices. Mauris efficitur auctor pulvinar. In finibus nunc quis nisl interdum fermentum sit amet at odio. Suspendisse vitae lorem vulputate, eleifend nunc nec, scelerisque enim. Aliquam vulputate venenatis porttitor. In hac habitasse platea dictumst.
			</p>
			<ol>
				<li>Foo</li>
				<li>Bar</li>
			</ol>
			<p>
				Vestibulum varius nisl a ante vehicula, eu euismod justo ornare. Praesent purus velit, finibus at varius sed, malesuada et orci. Integer vel accumsan enim, sit amet elementum lorem. Fusce tincidunt urna vitae ligula vehicula, consectetur sagittis orci bibendum. Praesent quis velit in massa aliquam commodo in ut elit. Nulla viverra lectus in nibh semper, id ultricies est vehicula. Phasellus fermentum eget augue vitae consequat. Praesent bibendum fringilla ullamcorper. Praesent luctus ultrices enim, dapibus pretium tortor hendrerit vel. Fusce ultrices, risus vitae iaculis vehicula, ipsum dui tincidunt lacus, eu volutpat nibh magna vitae nisi. Aliquam quis nibh in erat faucibus cursus sit amet nec nisi. Sed bibendum diam ut eros pharetra tempus.
			</p>
			<q>[Quoted text] Vestibulum varius nisl a ante vehicula, eu euismod justo ornare. Praesent purus velit, finibus at varius sed, malesuada et orci.</q> <cite>— Author Name</cite>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at varius eros. Curabitur pulvinar metus diam, nec aliquet felis pellentesque et. Ut iaculis aliquam augue, sed vestibulum lacus varius at. Mauris et facilisis massa. Sed vehicula placerat convallis. Sed dui magna, semper non neque non, semper dapibus lacus.
			</p>
		</article>
		<aside>
			[aside]
		</aside>
	</main>

	<hr class="o⋄border-colorꘌancillary"/>

	<footer>
		bla bla copyright links
		<nav>
			<ul class="o⋄nav-list o⋄flex--centered-content">
				<li class="o⋄text-noselect o⋄colorꘌsecondary"><a href="./try">Try all products</a></li>
				<li class="o⋄text-noselect o⋄colorꘌsecondary"><a href="./privacy-policy">Privacy policy</a></li>
				<li class="o⋄text-noselect o⋄colorꘌsecondary"><a href="./customer-agreement">Terms of service</a>
				</li>
			</ul>
		</nav>
	</footer>
</div>
		`
}

////////////////////////////////////////////////////////////////////////////////////

export function DemoꓽIssues() {
	return `
TODO
`
}

////////////////////////////////////////////////////////////////////////////////////
/*
export function Fonts() {
	// https://en.wikipedia.org/wiki/Pangram
	const pangram = 'The five boxing wizards jump quickly -> Sphinx of black quartz, judge my vow! Pack my box with five dozen liquor jugs…'

	const FontModifiers = <>

		<strong>strong</strong>&nbsp;
		<em>emphasized</em>&nbsp;
		Font style:
		<ul>
			{['100', 'lighter', 'normal', 'bold', 'bolder', '900'].map(fw => <li style={{fontWeight: fw}}>{fw}</li>)}
		</ul>
	</>

	return `
		<>
			<p class="o⋄fontꘌfast-and-good-enough">
				Featuring the "fast and good enough" font-family (.o⋄fontꘌfast-and-good-enough)
				<br/>{ pangram }
				<br/>{FontModifiers}
			</p>
			<hr/>

			<p class="o⋄fontꘌsystem">
				Featuring the "system" font-family (.o⋄fontꘌsystem)
				<br/>{ pangram }
				<br/>{FontModifiers}
			</p>
			<hr/>

			<p class="o⋄fontꘌroboto">
				Featuring the nice and precise "roboto" font-family (.o⋄fontꘌroboto)
				<br/>{ pangram }
				<br/>{FontModifiers}
			</p>
			<hr/>

			<p class="o⋄fontꘌroboto-condensed">
				Featuring the nice and precise "roboto condensed" font-family (.o⋄fontꘌroboto-condensed)
				<br/>{ pangram }
				<br/>{FontModifiers}
			</p>
			<hr/>

			<p class="o⋄fontꘌroboto-mono">
				Featuring the code wise "roboto mono" font-family (.o⋄fontꘌroboto-mono)
				<br/>{ pangram }
				<br/>{FontModifiers}
			</p>
		</>
					`
}*/

////////////////////////////////////////////////////////////////////////////////////

export function Emojis() {
	return `
<main>
	<p>emoji 13.1
		https://emojipedia.org/emoji-13.1/

		😮‍💨 Face Exhaling
		😵‍💫 Face with Spiral Eyes
		😶‍🌫️ Face in Clouds
		❤️‍🔥 Heart on Fire
		❤️‍🩹 Mending Heart
		🧔‍♀️ Woman: Beard
		🧔🏻‍♀️ Woman: Light Skin Tone, Beard
		🧔🏼‍♀️ Woman: Medium-Light Skin Tone, Beard
		🧔🏽‍♀️ Woman: Medium Skin Tone, Beard
		🧔🏾‍♀️ Woman: Medium-Dark Skin Tone, Beard
		🧔🏿‍♀️ Woman: Dark Skin Tone, Beard
		🧔‍♂️ Man: Beard
		🧔🏻‍♂️ Man: Light Skin Tone, Beard
		🧔🏼‍♂️ Man: Medium-Light Skin Tone, Beard
		🧔🏽‍♂️ Man: Medium Skin Tone, Beard
		🧔🏾‍♂️ Man: Medium-Dark Skin Tone, Beard
		🧔🏿‍♂️ Man: Dark Skin Tone, Beard
	</p>
</main>
		`
}

////////////////////////////////////////////////////////////////////////////////////

export function Controls() {
	return `
<p>
	…some text… <a href="https://bettermotherfuckingwebsite.com/">link</a> …some text… <button>Click me!</button> …some text… <progress value=".5">progress</progress> …some text…
</p>

<p>
	What I’m saying is that it’s so, <button class="o⋄button--inline">so simple to make
	sites</button> easier to read...
</p>

Nicer scrollbars by default
<div class="o⋄border⁚default o⋄paddingꘌsmall" style="height: 200px; overflowY: scroll">
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
	<p>Hi</p>
</div>
		`
}

////////////////////////////////////////////////////////////////////////////////////

export function DemoꓽCommonMistakes() {
	return `
<h2>Empties</h2>
<ol>
	<li>empty line item, comment-only line item, and space-only line item follow:</li>
	<li></li>
	<li>{/* can't HTML comment from JSX*/}</li>
	<li> </li>
	<li>empty span [ <span></span> ], and a break [ <br/> ]</li>
	<li>empty div follows: [<div></div>]</li>
	<li>see also first cell of following table</li>
</ol>


<h2>Images</h2>

<table summary="Testing image attribute based diagnostic styling" id="imgtest">
	<thead>
	<tr>
		<th></th>
		<th scope="col">no alt</th>
		<th scope="col">empty alt</th>
		<th scope="col">filled alt</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<th scope="row">no title</th>
		<td><img src="https://placekitten.com/64/64" /></td>
		<td><img src="https://placekitten.com/64/64" alt="" /></td>
		<td><img src="https://placekitten.com/64/64" alt="blah" /></td>
	</tr>
	<tr>
		<th scope="row">empty title</th>
		<td><img src="https://placekitten.com/64/64" title="" /></td>
		<td><img src="https://placekitten.com/64/64" title="" alt="" /></td>
		<td><img src="https://placekitten.com/64/64" title="" alt="blah" /></td>
	</tr>
	<tr>
		<th scope="row">filled title</th>
		<td><img src="https://placekitten.com/64/64" title="blah" /></td>
		<td><img src="https://placekitten.com/64/64" title="blah" alt="" /></td>
		<td><img src="https://placekitten.com/64/64" title="blah" alt="blah" /></td>
	</tr>
	</tbody>
</table>


<h2>Tables</h2>

<table>
	<tr>
		<th>A</th>
		<th>B</th>
	</tr>
	<tr>
		<th>C</th>
		<td>1</td>
	</tr>
</table>

<table>
	<tr>
		<th scope>A</th>
		<th scope="">B</th>
	</tr>
	<tr>
		<th scope="diag">C</th>
		<td>1</td>
	</tr>
</table>

<table summary="">
	<tr>
		<th scope="col">A</th>
		<th scope="col">B</th>
	</tr>
	<tr>
		<th scope="row">C</th>
		<td>1</td>
	</tr>
</table>


<h2>Links</h2>

<ol>
	<li><a href="none">fillblah</a> (no title, filled href)</li>
	<li><a href="none" title="">fillblah</a> (empty title, filled href)</li>
	<li><a href="none" title="blah">fillblah</a> (filled title, filled href)</li>
	<li><a href="#">blah#</a> (no title, '#' href)</li>
	<li><a href="#" title="">blah#</a> (empty title, '#' href)</li>
	<li><a href="#" title="blah">blah#</a> (filled title, '#' href)</li>
	<li><a href="">blah</a> (no title, blank href)</li>
	<li><a href="" title="">blah</a> (empty title, blank href)</li>
	<li><a href="" title="blah">blah</a> (filled title, blank href)</li>
</ol>

<hr />
<img src='http://placekitten.com/200/300'/>
<a href='http://placekitten.com/'>a nice site in HTTP</a>
<iframe src='http://placekitten.com/'/>
<a href="#">Home</a>

<h2>Empties</h2>
<ol>
	<li>empty line item, comment-only line item, and space-only line item follow:</li>
	<li></li>
	<li><!-- comment --></li>
	<li> </li>
	<li>break inside a li [<br/>]</li>
	<li>empty div [<div></div>] and span [<span></span>]</li>
</ol>


<h2>Images</h2>
<p>broken (404)
<img title="404" src="https://test.test/testitest.png" />
</p>

<p>http (mixed content)
<img title="404" src="http://placekitten.com/200/300" />
</p>
`
}
