Based on [render-props](https://github.com/donavon/render-props) to allow any type of usage:

```jsx
import ErrorBoundary from '@monorepo-private/react--error-boundary'

<ErrorBoundary name={'omr:logo'}>
	{this.props.logo}
</ErrorBoundary>

<ErrorBoundary name={'foo'}
	render={() => trickyStuff() } />
}
```

WARNING !!!!
[React error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
are NOT really behaving like a try/catch. You MAY have to use an intermediate component to really catch errors. Ex.

```jsx
import ErrorBoundary from '@monorepo-private/react--error-boundary'

// Will NOT work!!!
<ErrorBoundary name={'foo'}>
	{dangerousFunctionThatThrow(x)}
</ErrorBoundary>

// Will work:
<ErrorBoundary name={'foo'}>
	{dangerousFunctionThatThrow.bind(null, x)} // ErrorBoundary will detect that the child is a function and call it inside a try/catch
</ErrorBoundary>

or
<ErrorBoundary name={'foo'}'
	render={dangerousFunctionThatThrow.bind(null, x)} />

or:
const View = ({x}) => (
		<Fragment>
			{RichText.renderⵧto_text(doc)} />
		</Fragment>
)
<ErrorBoundary name={'foo'}>
	<View x={x} />
</ErrorBoundary>
```

TODO read https://www.developerway.com/posts/how-to-handle-errors-in-react TODO review other
https://github.com/bvaughn/react-error-boundary/blob/master/src/ErrorBoundary.ts
