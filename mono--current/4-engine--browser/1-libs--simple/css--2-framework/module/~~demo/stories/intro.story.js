
export default {
	title: 'Foo',
	decorators: [
		(Story) => {
			import('@monorepo-private/css--foundation')
			return Story
		}
	]
}

export function Intro() {
	return `
		<main class="o⋄children-spacing⁚flow">
			<h1>{ LIB }</h1>
			<h2>a CSS micro framework</h2>

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
				<li>and many blogs posts…</li>
			</ol>
		</main>
	`
}

////////////////////////////////////////////////////////////////////////////////////

export function ResetꓽBase() {
	return `
			<div className="o⋄children-spacing⁚flow">
				<h1>The five boxing wizards jump quickly</h1>
				<h2>Sphinx of black quartz, judge my vow!</h2>
				<h3>Pack my box with five dozen liquor jugs!</h3>
				<p>
					{ LIB } provides CSS reset/normalization through
					{' '}
					<a href="https://necolas.github.io/normalize.css/">normalize.css</a>
				</p>
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

export function ResetꓽControls() {
	return `
			<form action="" className="o⋄children-spacing⁚flow">
				<table summary="dev">

					<tr>
						<td>
							input type = button
						</td>
						<td>
							<div className="o⋄input-container">
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
							<div className="o⋄input-container">
								<input type="checkbox" name="checkbox" /> deselected
							</div>
							<div className="o⋄input-container">
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
							<div className="o⋄input-container">
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
							<div className="o⋄input-container">
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

					<div className="o⋄input-container">
						<input type="checkbox" id="berries_1" value="strawberries" name="berries" />
						<label htmlFor="berries_1">Strawberries</label>
					</div>
					<div className="o⋄input-container">
						<input type="checkbox" id="berries_2" value="blueberries" name="berries" checked={true}/>
						<label htmlFor="berries_2">Blueberries</label>
					</div>
					<div className="o⋄input-container">
						<input type="checkbox" id="berries_3" value="bananas" name="berries" />
						<label htmlFor="berries_3">Bananas (yes, they are berries)</label>
					</div>
					<div className="o⋄input-container">
						<input type="checkbox" id="berries_4" value="blackberries" name="berries" checked={true}/>
						<label htmlFor="berries_4">Blackberries</label>
					</div>
					<div className="o⋄input-container">
						<input type="checkbox" id="berries_5" value="loganberries" name="berries" />
						<label htmlFor="berries_5">Loganberries</label>
					</div>
				</fieldset>

				<fieldset>
					<legend>Fieldset radio</legend>

					<div className="o⋄input-container">
						<input type="radio" id="kraken" name="monster" />
						<label htmlFor="kraken">Kraken</label><br/>
					</div>

					<div className="o⋄input-container">
						<input type="radio" id="sasquatch" name="monster" checked={true}/>
						<label htmlFor="sasquatch">Sasquatch</label><br/>
					</div>

					<div className="o⋄input-container">
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
