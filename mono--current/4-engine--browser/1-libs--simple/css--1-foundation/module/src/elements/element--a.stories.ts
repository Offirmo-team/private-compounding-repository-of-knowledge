export * from "@monorepo-private/storypad/stories/html/elements/a"
import { _link } from "@monorepo-private/storypad/stories/html/elements/a"

export function CustomStyling1() {
	return `
<style>
[data-o-theme="light-test"] { /* data-o-theme="light-test" */
	color-scheme: light;

	--o⋄color⁚fg--main: light-dark(#586E75, #839496);
	--o⋄color⁚bg--main: light-dark(#FDF6E3, #002B36);

	--o⋄color⁚fg--link: light-dark(#268BD2, #268BD2);
	--o⋄color⁚fg--link--active: light-dark(#268BD2, #268BD2);
	--o⋄color⁚fg--link--visited: light-dark(#268BD2, #268BD2);
}
</style>

<div data-o-theme="light-test">
	${_link()}
</div>
	`
}
